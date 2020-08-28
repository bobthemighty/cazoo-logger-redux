import { Context } from "aws-lambda"
import { Logger, PinoLogger } from "../core"
import { forSns } from "./sns"

type LogExtension<T extends Logger, S extends Logger> = (base: T) => S

function fromContext(event: object, ctx: Context, options = {}) {
    const context = forSns(event, ctx, options);
    return PinoLogger(options, {context })
}

export function contextFactory<S extends Logger> (transform: LogExtension<Logger, S>) {
    return (event: object, ctx: Context, options = {}) => {
        return transform(fromContext(event, ctx, options))
    }
}
