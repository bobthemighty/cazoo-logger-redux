import {child, Logger, Context} from "./core"

function withData<TLogger extends Logger> (this: TLogger, data: Context) : TLogger {
    return child(this, {data})
}

function withContext<TLogger extends Logger> (this: TLogger, context: Context) : TLogger {
    return child(this, {context})
}

export interface FluentContext {
    withData: (data: Context) => this
    withContext: (context: Context) => this
}

export function addFluentContext<TLogger extends Logger>(target: TLogger) : TLogger & FluentContext {
    return Object.defineProperties(target, {
        withData: {
            value: withData,
            enumerable: true
        },
        withContext: {
            value: withContext,
            enumerable: true
        }
    })
}
