import { Context } from "aws-lambda"
import { Logger } from "../types"
import { PinoLogger } from "../core"
import { forSns } from "./sns"
import { forApiGateway } from "./apiGateway"
import { LogExtension } from "../types"


function fromContext(event: object, ctx: Context, options = {}) {
    const context = forApiGateway(event, ctx, options) || forSns(event, ctx, options);
    return PinoLogger(options, {context })
}

export function contextFactory<S extends Logger> (transform: LogExtension<Logger, S>) {
    return (event: object, ctx: Context, options = {}) => {
        return transform(fromContext(event, ctx, options))
    }
}
