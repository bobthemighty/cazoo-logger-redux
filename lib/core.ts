import SonicBoom from "sonic-boom";
import Pino from "pino";
import deepmerge from "deepmerge";

type OutputSpec = SonicBoom | NodeJS.WritableStream;

type Level = "debug" | "info" | "warn" | "error";

interface LoggerOptions {
  stream: OutputSpec;
  level: Level;
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

function makeLog(level: string) {
  return function log(
    this: Logger,
      obj: Record<string, unknown> | string,
    msg?: string | undefined,
    ...args: unknown[]
  ): void {
    if (typeof obj === "string") this.instance[level](obj, ...args);
    else this.instance[level](obj, msg, ...args);
  };
}

function makeOutput(spec?: OutputSpec) {
  if (undefined === spec)
    return new SonicBoom({ fd: process.stdout.fd, sync: true });
  return spec;
}

export function child<T extends Logger>(logger: T, context: Context): T {
  const merged = deepmerge(logger.context, context);
  const instance = logger.instance.child(merged);
  return {
    ...logger,
    context,
    instance
  };
}

function makeOpts(opts: Partial<LoggerOptions>): Pino.LoggerOptions {
  return {
    timestamp: false,
    level: opts.level || process.env.CAZOO_LOGGER_LEVEL || "info",
    formatters: {
      level(label) {
        return { level: label };
      }
    },
    base: null
  };
}

export function PinoLogger(options: Partial<LoggerOptions> = {}): Logger {
  const context: Context = {};
  const output = makeOutput(options.stream);
  const pinoOpts = makeOpts(options);
  const instance = Pino(pinoOpts, output);

  return {
    context,
    instance,
    output,

    debug: makeLog("debug"),
    info: makeLog("info"),
    warn: makeLog("warn"),
    error: makeLog("error")
  };
}
