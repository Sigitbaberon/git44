import { RemovalJob } from "@shared/api";
import {
  getRemovalJob,
  updateRemovalJob,
  getActiveScraperApiKey,
  markKeyAsLimited,
  markKeyAsCooldown,
} from "./db";
import { processRemovalJob } from "./removesora";

// Job queue with FIFO ordering and concurrency control
class JobQueue {
  private queue: string[] = []; // Job IDs
  private processing: Set<string> = new Set();
  private maxConcurrency: number = 3;
  private pollInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.pollInterval = setInterval(() => {
      this.processNextJob();
    }, 2000); // Check every 2 seconds
  }

  stop() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    this.isRunning = false;
  }

  enqueue(jobId: string) {
    if (!this.queue.includes(jobId)) {
      this.queue.push(jobId);
    }
  }

  private async processNextJob() {
    // If we're at max concurrency, wait
    if (this.processing.size >= this.maxConcurrency) {
      return;
    }

    // Get next job from queue
    while (this.queue.length > 0) {
      const jobId = this.queue.shift();
      if (!jobId) break;

      const job = getRemovalJob(jobId);
      if (!job) continue;

      // Skip if already processing or completed
      if (this.processing.has(jobId) || job.status !== "queued") {
        continue;
      }

      this.processing.add(jobId);

      try {
        await this.processJob(jobId);
      } catch (error) {
        console.error(`Error processing job ${jobId}:`, error);
      } finally {
        this.processing.delete(jobId);
      }

      // Return after processing one job so we don't process all at once
      break;
    }
  }

  private async processJob(jobId: string) {
    const job = getRemovalJob(jobId);
    if (!job) return;

    // Update job status to processing
    updateRemovalJob(jobId, {
      status: "processing",
      startedAt: new Date().toISOString(),
    });

    try {
      // Call the RemoveSora processing function
      const result = await processRemovalJob(jobId);

      if (result.success) {
        // Job completed successfully
        updateRemovalJob(jobId, {
          status: "success",
          outputLink: result.outputLink,
          completedAt: new Date().toISOString(),
        });
      } else if (result.retry) {
        // Job can be retried
        const currentJob = getRemovalJob(jobId);
        if (currentJob && currentJob.retryCount < currentJob.maxRetries) {
          updateRemovalJob(jobId, {
            status: "queued",
            retryCount: currentJob.retryCount + 1,
          });
          // Re-enqueue for retry
          this.enqueue(jobId);
        } else {
          // Max retries reached
          updateRemovalJob(jobId, {
            status: "failed",
            error: result.error || "Max retries exceeded",
            completedAt: new Date().toISOString(),
          });
        }
      } else {
        // Job failed permanently
        updateRemovalJob(jobId, {
          status: "failed",
          error: result.error || "Processing failed",
          completedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      // Handle unexpected errors
      const currentJob = getRemovalJob(jobId);
      if (currentJob && currentJob.retryCount < currentJob.maxRetries) {
        updateRemovalJob(jobId, {
          status: "queued",
          retryCount: currentJob.retryCount + 1,
        });
        this.enqueue(jobId);
      } else {
        updateRemovalJob(jobId, {
          status: "failed",
          error: String(error),
          completedAt: new Date().toISOString(),
        });
      }
    }
  }

  getStats() {
    return {
      queued: this.queue.length,
      processing: this.processing.size,
    };
  }
}

// Export singleton instance
export const jobQueue = new JobQueue();

// Start the queue
jobQueue.start();
