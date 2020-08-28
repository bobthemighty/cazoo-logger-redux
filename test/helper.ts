import {Transform} from 'stream';
import split = require('split2');

export function sink(raw = false): Transform {
  if (raw) {
    return split();
  }
  return split(JSON.parse);
}

export function once<T>(
  emitter: NodeJS.EventEmitter,
  name: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (name !== 'error') emitter.once('error', reject);
    emitter.once(name, (...args) => {
      emitter.removeListener('error', reject);
      resolve(...args);
    });
  });
}
