import {Logger} from './core';

export interface TimeoutLogger {
  timeoutHandle?: NodeJS.Timeout;
  setTimeout: () => void;
  clearTimeout: () => void;
}

function _setTimeout(this: TimeoutLogger) {
  if (this.timeoutHandle) return;
  this.timeoutHandle = setTimeout(() => console.log('foo'), 200);
}

function _clearTimeout(this: TimeoutLogger) {
  if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
}

export function addTimeout<T extends Logger>(target: T): T & TimeoutLogger {
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
