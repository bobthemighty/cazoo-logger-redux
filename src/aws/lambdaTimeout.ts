import {EventBridgeEvent} from 'aws-lambda';

type Direction = 'IN' | 'OUT';

export interface EventRecorder {
  recordEvent(event: EventBridgeEvent<string, unknown>, dir: Direction): void;
}
