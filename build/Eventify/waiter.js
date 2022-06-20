class Waiter {
    constructor() {
        this.waitMap = new Map();
    }
    getEvent(eventName, args) {
        const { promise } = this.accessEvent(eventName);
        if (args && args.once) {
            this.deleteEvent(eventName);
        }
        if (args && args.timeLimit) {
            const timeLimit = Waiter.waitTime(args.timeLimit.timeInMS, args.timeLimit.value);
            return Promise.race([promise, timeLimit]);
        }
        return promise;
    }
    setEvent(eventName, data) {
        this.accessEvent(eventName).resolver(data);
    }
    deleteEvent(eventName) {
        this.waitMap.delete(eventName);
    }
    accessEvent(eventName) {
        if (!this.waitMap.has(eventName)) {
            this.waitMap.set(eventName, Waiter.makeRemotePromise());
        }
        return this.waitMap.get(eventName);
    }
    static waitTime(timeInMS, value) {
        const { promise, resolver } = Waiter.makeRemotePromise();
        setTimeout(resolver.bind(null, value), timeInMS);
        return promise;
    }
    static makeRemotePromise() {
        let resolver = () => undefined;
        const promise = new Promise((resolve) => { resolver = resolve; });
        return { promise, resolver };
    }
}
export { Waiter };
