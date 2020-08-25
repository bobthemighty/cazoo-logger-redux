import {PinoLogger} from './core'
import { addFluentContext } from "./fluentContext"

export function empty (options = {}) { return addFluentContext(PinoLogger(options)) }
