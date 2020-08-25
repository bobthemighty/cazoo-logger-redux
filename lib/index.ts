import { PinoLogger, Logger } from "./core";
import { addFluentContext, FluentContext } from "./fluentContext";
import { addTimeout, TimeoutLogger } from "./timeout";

type CazooLogger = Logger & TimeoutLogger & FluentContext;

export function empty(options = {}): CazooLogger {
  return addTimeout(addFluentContext(PinoLogger(options)));
}
