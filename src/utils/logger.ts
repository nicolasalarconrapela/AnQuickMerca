export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any[];
}

class Logger {
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];
  private maxLogs = 1000;
  private isHijacked = false;

  constructor() {
    this.hijackConsole();
  }

  private hijackConsole() {
    if (this.isHijacked) return;

    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };

    console.log = (...args: any[]) => {
      this.addLog("info", args);
      originalConsole.log(...args);
    };

    console.warn = (...args: any[]) => {
      this.addLog("warn", args);
      originalConsole.warn(...args);
    };

    console.error = (...args: any[]) => {
      this.addLog("error", args);
      originalConsole.error(...args);
    };

    console.debug = (...args: any[]) => {
      this.addLog("debug", args);
      originalConsole.debug(...args);
    };

    this.isHijacked = true;
  }

  private safeStringify(obj: any): string {
    if (typeof obj === "string") return obj;
    try {
      if (obj instanceof Error) {
        return `${obj.name}: ${obj.message}\n${obj.stack || ""}`;
      }
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return String(obj);
    }
  }

  private addLog(level: LogLevel, args: any[]) {
    const message = args.map((a) => this.safeStringify(a)).join(" ");
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: Date.now(),
      level,
      message,
      data: args,
    };

    this.logs.unshift(newLog); // prepend so newest is first
    if (this.logs.length > this.maxLogs) {
      this.logs.pop(); // remove oldest
    }
    this.notifyListeners();
  }

  public getLogs() {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
    this.notifyListeners();
  }

  public subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    listener(this.logs);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l(this.logs));
  }
}

export const logger = new Logger();
