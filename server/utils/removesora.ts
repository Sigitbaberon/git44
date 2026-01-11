import { getRemovalJob, updateRemovalJob, getActiveScraperApiKey, markKeyAsLimited, markKeyAsCooldown } from "./db";

const REMOVESORA_API = "https://www.removesorawatermark.online/api/removesora";
const SCRAPER_API_URL = "http://api.scraperapi.com";

interface ProcessResult {
  success: boolean;
  retry: boolean;
  error?: string;
  outputLink?: string;
}

/**
 * Process a removal job through RemoveSora with ScraperAPI
 */
export async function processRemovalJob(jobId: string): Promise<ProcessResult> {
  const job = getRemovalJob(jobId);
  if (!job) {
    return { success: false, retry: false, error: "Job not found" };
  }

  try {
    // Step 1: Initialize task with POST request
    const taskId = await initializeTask(job.inputLink);
    if (!taskId) {
      return { success: false, retry: true, error: "Failed to initialize task" };
    }

    // Update job with task ID
    updateRemovalJob(jobId, { taskId, status: "polling" });

    // Step 2: Poll for results
    const outputLink = await pollForResults(jobId, taskId);
    if (!outputLink) {
      return { success: false, retry: true, error: "Polling timeout or failed" };
    }

    return { success: true, retry: false, outputLink };
  } catch (error) {
    console.error(`Error processing job ${jobId}:`, error);
    return {
      success: false,
      retry: true,
      error: String(error),
    };
  }
}

async function initializeTask(videoLink: string): Promise<string | null> {
  const scraperKey = getActiveScraperApiKey();
  if (!scraperKey) {
    throw new Error("No active ScraperAPI key available");
  }

  try {
    const scraperUrl = `${SCRAPER_API_URL}?api_key=${scraperKey.apiKey}&url=${encodeURIComponent(`${REMOVESORA_API}/remove`)}`;

    const response = await fetch(scraperUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: videoLink }),
    });

    if (response.status === 403 || response.status === 429) {
      // API key is limited
      markKeyAsLimited(scraperKey.id);
      throw new Error("ScraperAPI key limited, trying next key");
    }

    if (!response.ok) {
      throw new Error(`Failed to initialize task: ${response.statusText}`);
    }

    const data = await response.json();
    return data.taskId || null;
  } catch (error) {
    console.error("Error initializing task:", error);
    throw error;
  }
}

async function pollForResults(jobId: string, taskId: string): Promise<string | null> {
  const maxPolls = 8;
  const pollInterval = 3000 + Math.random() * 2000; // 3-5 seconds

  for (let poll = 0; poll < maxPolls; poll++) {
    // Wait before polling
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const scraperKey = getActiveScraperApiKey();
    if (!scraperKey) {
      throw new Error("No active ScraperAPI key available");
    }

    try {
      const pollUrl = `${SCRAPER_API_URL}?api_key=${scraperKey.apiKey}&url=${encodeURIComponent(`${REMOVESORA_API}/download/${taskId}?linkOnly=1`)}`;

      const response = await fetch(pollUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 403 || response.status === 429) {
        markKeyAsLimited(scraperKey.id);
        throw new Error("ScraperAPI key limited");
      }

      if (!response.ok) {
        throw new Error(`Poll failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Update poll count
      const job = getRemovalJob(jobId);
      if (job) {
        updateRemovalJob(jobId, { pollCount: poll + 1 });
      }

      if (data.status === "success" && data.link) {
        return data.link;
      } else if (data.status === "failed" || data.error) {
        throw new Error(data.error || "Processing failed");
      }

      // Continue polling if status is "processing"
    } catch (error) {
      console.error(`Error during poll ${poll + 1}:`, error);

      // Don't throw on poll errors, just continue
      if (poll === maxPolls - 1) {
        throw new Error("Max polling attempts reached");
      }
    }
  }

  return null;
}

/**
 * Test RemoveSora connectivity (for health checks)
 */
export async function testRemoveSoraConnectivity(): Promise<boolean> {
  try {
    const response = await fetch(REMOVESORA_API, { method: "OPTIONS" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get system status
 */
export async function getSystemStatus() {
  const scraperKey = getActiveScraperApiKey();
  const removeSoraOnline = await testRemoveSoraConnectivity();

  return {
    scraperApiReady: !!scraperKey,
    removeSoraOnline,
    activeKey: scraperKey ? scraperKey.id : null,
  };
}
