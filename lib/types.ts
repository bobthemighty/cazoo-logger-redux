export type OutputSpec = SonicBoom | NodeJS.WritableStream;

export type Level = "debug" | "info" | "warn" | "error";

export interface LoggerOptions {
    level: Level;
    service: string;
    stream: OutputSpec;
}

export interface Context {
    [key: string]: unknown;
}

export interface LogFn {
    (msg: string, ...args: any[]): void;
    (obj: any, msg?: string, ...args: unknown[]): void;
}

export interface Logger {
    debug: LogFn;
    info: LogFn;
    warn: LogFn;
    error: LogFn;

    context: Context;

    output: OutputSpec;
    instance: Pino.Logger;
}

export type LogExtension<T extends Logger, S extends Logger> = (base: T) => S

