import {Context} from 'aws-lambda';
import {PinoLogger, Logger, LoggerOptions} from './core';
import {addFluentContext, FluentContext} from './fluentContext';
import {useEventRecorder, EventRecorder} from './eventRecorder';
import {addTimeout, TimeoutLogger} from './timeout';
import {useErrorRecorder, ErrorRecorder} from './errorRecorder';
import {useHttpRecorder, HttpRecorder} from './httpRequest';

import {AnyEvent, contextFactory, LambdaContext} from './aws';

type CazooLogger = Logger &
  TimeoutLogger &
  FluentContext &
  EventRecorder &
  HttpRecorder &
  ErrorRecorder;

function logger(base: Logger<LambdaContext>): CazooLogger {
  return useHttpRecorder(
    useErrorRecorder(useEventRecorder(addTimeout(addFluentContext(base))))
  );
}

export function empty(options = {}): Logger & FluentContext & ErrorRecorder {
  return useErrorRecorder(addFluentContext(PinoLogger(options, {})));
}

export const fromContext = (
  e: AnyEvent,
  c: Context,
  o: Partial<LoggerOptions>
) => {
  const log = contextFactory(logger)(e, c, o);
  log.setTimeout(c);
  return log;
};
