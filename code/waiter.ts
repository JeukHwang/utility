/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Resolve } from "./type";

type RemotePromise<T> = { promise: Promise<T>, resolver: Resolve<T> };
type Option<T> = Partial<{
    once : boolean,
    timeLimit : Required<{timeInMS : number, value:T}>
}>

class Waiter {
    private readonly waitMap: Map<string, RemotePromise<any>>;
    constructor() {
        this.waitMap = new Map();
    }

    public getEvent<T>(eventName: string, args?:Option<T>): Promise<T> {
        const { promise } = this.accessEvent<T>(eventName);
        if (args.once) { this.deleteEvent(eventName); }
        if (args.timeLimit) {
            const timeLimit:Promise<T> = Waiter.waitTime<T>(args.timeLimit.timeInMS, args.timeLimit.value);
            return Promise.race<T>([promise, timeLimit]);
        }
        return promise;
    }
    public setEvent<T>(eventName: string, data: T): void {
        this.accessEvent<T>(eventName).resolver(data);
    }
    public deleteEvent(eventName: string): void {
        this.waitMap.delete(eventName);
    }

    private accessEvent<T>(eventName: string): RemotePromise<T> {
        if (this.waitMap.has(eventName)) { return this.waitMap.get(eventName); }
        this.waitMap.set(eventName, Waiter.makeRemotePromise<T>());
        return this.waitMap.get(eventName);
    }

    public static waitTime<T=void>(timeInMS: number, value:T = undefined): Promise<T> {
        const { promise, resolver } = Waiter.makeRemotePromise<T>();
        setTimeout(resolver.bind(null, value), timeInMS);
        return promise;
    }

    public static makeRemotePromise<T>(): RemotePromise<T> {
        let resolver:Resolve<T>;
        const promise:Promise<T> = new Promise<T>((resolve:Resolve<T>) => { resolver = resolve; });
        return { promise, resolver };
    }
}

export { Waiter };

