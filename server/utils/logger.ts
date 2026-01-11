export type LogLevel = "info" | "warn" | "error" | "debug";
export type LogType = "request" | "error" | "retry" | "cooldown" | "quota" | "api_usage" | "admin_action" | "system";

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  type: LogType;
  message: string;
  userId?: string;
  jobId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 10000;

  log(
    level: LogLevel,
    type: LogType,
    message: string,
    options?: {
      userId?: string;
      jobId?: string;
      metadata?: Record<string, any>;
    }
  ) {
    const entry: LogEntry = {
      id: "log-" + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      level,
      type,
      message,
      userId: options?.userId,
      jobId: options?.jobId,
      metadata: options?.metadata,
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${type.toUpperCase()}]`;
    const logMessage = `${prefix} ${message}`;

    switch (level) {
      case "error":
        console.error(logMessage, options?.metadata);
        break;
      case "warn":
        console.warn(logMessage, options?.metadata);
        break;
      case "debug":
        console.debug(logMessage, options?.metadata);
        break;
      default:
        console.log(logMessage, options?.metadata);
    }
  }

  info(type: LogType, message: string, options?: any) {
    this.log("info", type, message, options);
  }

  warn(type: LogType, message: string, options?: any) {
    this.log("warn", type, message, options);
  }

  error(type: LogType, message: string, options?: any) {
    this.log("error", type, message, options);
  }

  debug(type: LogType, message: string, options?: any) {
    this.log("debug", type, message, options);
  }

  getLogs(filter?: { type?: LogType; userId?: string; limit?: number }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.type) {
      filtered = filtered.filter(log => log.type === filter.type);
    }

    if (filter?.userId) {
      filtered = filtered.filter(log => log.userId === filter.userId);
    }

    const limit = filter?.limit || 100;
    return filtered.slice(-limit);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
