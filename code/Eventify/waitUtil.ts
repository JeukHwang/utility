/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-classes-per-file */
import React, { useEffect, useState } from "react";
import type { Socket } from "socket.io";
import { Waiter } from "./waiter";


function waitDOMEvent(type:keyof WindowEventMap, options?:boolean | AddEventListenerOptions): Promise<Event> {
    const { promise, resolver } = Waiter.makeRemotePromise<Event>();
    window.addEventListener(type, (e:Event):void => resolver(e), options || { once: true });
    return promise;
}

// React
function waitThenAffect(promise:Promise<unknown>, effect:React.EffectCallback) {
    const [state, setState] = useState<boolean>(false);
    useEffect(effect, [state]);
    promise.then(() => { setState(true); });
}

// React, Socket.io
async function onceThenAffect<Res>(socket:Socket, eventName:string, effect:React.EffectCallback) {
    const [state, setState] = useState<Res>();
    useEffect(effect, [state]);
    socket.once(eventName, (args:Res) => { setState(args); });
}

// React, Socket.io
async function onThenAffect<Res>(socket:Socket, eventName:string, effect:React.EffectCallback) {
    const [state, setState] = useState<Res>();
    useEffect(effect, [state]);
    socket.on(eventName, (args:Res) => { setState(args); });
}

// Socket.io
async function waitResponse<Res>(socket:Socket, eventName:string, ...data:unknown[]) {
    const { promise, resolver } = Waiter.makeRemotePromise<Res>();
    socket.once(eventName, (args:Res) => { resolver(args); });
    socket.emit(eventName, ...data);
    return promise;
}

export { waitDOMEvent, waitThenAffect, onceThenAffect, onThenAffect, waitResponse };

