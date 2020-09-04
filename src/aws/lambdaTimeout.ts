import {EventBridgeEvent} from 'aws-lambda';
import {LambdaContext} from './context';
import {Logger} from '../core';

const OUT = 'out';
const IN = 'in';

type Direction = 'IN' | 'OUT';

export interface EventRecorder {
  recordEvent(event: EventBridgeEvent<string, unknown>, dir: Direction): void;
}
