import {Logger} from './core';

export type MaybeError = Error | Record<string, unknown> | any;

interface ErrorRecord {
  msg: string;
  error: {
    message: string;
    stack?: string;
    name: string;
  };
}

function makeErrorRecord(error: MaybeError, msg?: string): ErrorRecord {
  let errorObj: Error;
  if (error instanceof Error) {
    errorObj = error;
  } else if (error instanceof Object) {
    errorObj = {
      message: JSON.stringify(error),
      stack: undefined,
      name: typeof error,
    };
  } else {
    errorObj = {
      message: error.toString(),
      stack: undefined,
      name: typeof error,
    };
  }
  return {
    msg: msg || errorObj.message,
    error: {
      message: errorObj.message,
      stack: errorObj.stack,
      name: errorObj.name,
    },
  };
}

function _recordError(this: Logger, e: any, msg?: string): void {
  this.error(makeErrorRecord(e, msg));
}

function _recordErrorAsWarning(this: Logger, e: any, msg?: string): void {
  this.warn(makeErrorRecord(e, msg));
}

export function useErrorRecorder<TLogger extends Logger>(
  base: TLogger
): TLogger & ErrorRecorder {
  return Object.defineProperties(base, {
    recordError: {
      value: _recordError,
      enumerable: true,
    },
    recordErrorAsWarning: {
      value: _recordErrorAsWarning,
      enumerable: true,
    },
  });
}

export interface ErrorRecorder {
  recordError(error: MaybeError, msg?: string): void;
  recordErrorAsWarning(error: MaybeError, msg?: string): void;
}
