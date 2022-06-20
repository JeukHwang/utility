/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-classes-per-file */
import { useEffect, useState } from "react";
import { Waiter } from "./waiter";
function waitDOMEvent(type, options) {
    const { promise, resolver } = Waiter.makeRemotePromise();
    window.addEventListener(type, (e) => resolver(e), options || { once: true });
    return promise;
}
// React
function waitThenAffect(promise, effect) {
    const [state, setState] = useState(false);
    useEffect(effect, [state]);
    promise.then(() => { setState(true); });
}
// React, Socket.io
async function onceThenAffect(socket, eventName, effect) {
    const [state, setState] = useState();
    useEffect(effect, [state]);
    socket.once(eventName, (args) => { setState(args); });
}
// React, Socket.io
async function onThenAffect(socket, eventName, effect) {
    const [state, setState] = useState();
    useEffect(effect, [state]);
    socket.on(eventName, (args) => { setState(args); });
}
// Socket.io
async function waitResponse(socket, eventName, ...data) {
    const { promise, resolver } = Waiter.makeRemotePromise();
    socket.once(eventName, (args) => { resolver(args); });
    socket.emit(eventName, ...data);
    return promise;
}
export { waitDOMEvent, waitThenAffect, onceThenAffect, onThenAffect, waitResponse };
