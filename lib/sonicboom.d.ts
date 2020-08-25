// Type definitions for sonic-boom 0.7
// Project: https://github.com/mcollina/sonic-boom
// Definitions by: Alex Ferrando <https://github.com/alferpal>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node"/>

declare module "sonic-boom" {

import { EventEmitter } from 'events';

export = SonicBoom;


    type Destination =
        {fd: number } |
        {dest: string}

    interface Options  {
        minLength?: number
        sync?: boolean
    }


class SonicBoom extends EventEmitter {
    /**
     * @returns a new sonic-boom instance
     */
    constructor(opts: Destination & Options)

    /**
     * Writes the string to the file. It will return false to signal the producer to slow down.
     */
    write(string: string): void;

    /**
     * Writes the current buffer to the file if a write was not in progress.
     * Do nothing if minLength is zero or if it is already writing.
     */
    flush(): void;

    /**
     * Reopen the file in place, useful for log rotation.
     */
    reopen(fileDescriptor?: string | number): void;

    /**
     * Flushes the buffered data synchronously. This is a costly operation.
     */
    flushSync(): void;

    /**
     * Closes the stream, the data will be flushed down asynchronously
     */
    end(): void;

    /**
     * Closes the stream immediately, the data is not flushed.
     */
    destroy(): void;
}
}
