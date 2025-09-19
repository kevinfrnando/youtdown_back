import path from "path";
import fs from "fs";

enum LogLevel {
  "INFO",
  "WARN",
  "ERROR",
}

export class FileLoggerAdapter {
  private logDir: string;

  constructor(logDir: string = "logs") {
    this.logDir = path.join(process.cwd(), logDir);

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getLogFile(): string {
    const date = new Date().toISOString().split("T")[0];
    return path.join(this.logDir, `${date}.log`);
  }

  private log(level: LogLevel, message: string) {
    const logFile = this.getLogFile();
    const log = `[${new Date().toISOString()}] [${level}] ${message}\n`;
    fs.appendFileSync(logFile, log);
  }

  info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message);
  }

  error(message: string) {
    this.log(LogLevel.ERROR, message);
  }
}
