/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-classes-per-file */
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io";
import { Waiter } from "./waiter";


function waitDOMEvent(type:keyof WindowEventMap, options?:boolean | AddEventListenerOptions): Promise<Event> {
    const { promise, resolver } = Waiter.makeRemotePromise<Event>();
    window.addEventListener(type, (e:Event):void => resolver(e), options || { once: true });
    return promise;
}

// React
function waitThenAffect(promise:Promise<unknown>, effect:React.EffectCallback) {
    const [state, setState] = useState(false);
    useEffect(effect, [state]);
    promise.then(() => { setState(true); });
}

// React, Socket.io
async function onceThenAffect(socket:Socket, eventName:string, effect:React.EffectCallback) {
    const [state, setState] = useState(undefined);
    useEffect(effect, [state]);
    socket.once(eventName, (...args) => { setState(args); });
}

// React, Socket.io
async function onThenAffect(socket:Socket, eventName:string, effect:React.EffectCallback) {
    const [state, setState] = useState(undefined);
    useEffect(effect, [state]);
    socket.on(eventName, (...args) => { setState(args); });
}

export { waitDOMEvent, waitThenAffect, onceThenAffect, onThenAffect };

