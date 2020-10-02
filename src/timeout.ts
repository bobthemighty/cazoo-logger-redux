import {Context} from 'aws-lambda';
import {Logger} from './core';
import {LambdaContext} from './aws';

const MINIMUM_VALID_TIMEOUT_MS = 50;
const DEFAULT_BUFFER_MS = 10;

export interface TimeoutLogger {
  timeoutHandle?: NodeJS.Timeout;
  setTimeout: (context: Context) => void;
  clearTimeout: () => void;
}

const getTimeoutBuffer = (): number => {
  let buffer = DEFAULT_BUFFER_MS;
  if (process.env.CAZOO_LOGGER_TIMEOUT_BUFFER_MS) {
    const candidate = parseInt(process.env.CAZOO_LOGGER_TIMEOUT_BUFFER_MS);
    if (isNaN(candidate)) {
      process.stderr.write(
        `Unable to parse non-numeric logger timeout buffer '${process.env.CAZOO_LOGGER_TIMEOUT_BUFFER_MS}'`
      );
    } else {
      buffer = candidate;
    }
  }
  return buffer;
};

function writeTimeoutLog(logger: Logger<LambdaContext>) {
  const fn = logger.context.context.function || {};

  logger.error(
    {
      Service: fn.service || 'Unknown',
      Function: fn.name,
      Timeouts: 1,
      type: 'lambda.timeout',

      _aws: {
        Timestamp: new Date().getTime(),
        CloudWatchMetrics: [
          {
            Namespace: 'Cazoo',
            Dimensions: [['Service'], ['Service', 'Function']],
            Metrics: [{Name: 'Timeouts'}],
          },
        ],
      },
    },
    'Lambda Timeout'
  );
}

function _setTimeout(
  this: Logger<LambdaContext> & TimeoutLogger,
  context: Context
) {
  if (this.timeoutHandle) return;
  if (!('getRemainingTimeInMillis' in context)) return;
  const timeoutMs = context.getRemainingTimeInMillis() - getTimeoutBuffer();
  if (timeoutMs > MINIMUM_VALID_TIMEOUT_MS) {
    this.timeoutHandle = setTimeout(() => writeTimeoutLog(this), timeoutMs);
  }
}

function _clearTimeout(this: Logger<LambdaContext> & TimeoutLogger) {
  if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
}

export function addTimeout<T extends Logger<LambdaContext>>(
  target: T
): T & TimeoutLogger {
  const enumerable = true;
  return Object.defineProperties(target, {
    setTimeout: {
      enumerable,
      value: _setTimeout,
    },
    clearTimeout: {
      enumerable,
      value: _clearTimeout,
    },
  });
}
