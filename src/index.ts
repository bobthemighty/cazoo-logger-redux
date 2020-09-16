import {PinoLogger, Logger} from './core';
import {addFluentContext, FluentContext} from './fluentContext';
import {useEventRecorder, EventRecorder} from './eventRecorder';
import {addTimeout, TimeoutLogger} from './timeout';
import {useErrorRecorder, ErrorRecorder} from './errorRecorder';
import {useHttpRecorder, HttpRecorder} from './httpRequest';

import {contextFactory, LambdaContext} from './aws';

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

export const fromContext = contextFactory(logger);
