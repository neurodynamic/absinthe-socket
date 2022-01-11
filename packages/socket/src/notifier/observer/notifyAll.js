// @flow

import type {Event, Observer} from "../types";

const getNotifier = function(handlerName, payload) {
  return function(observer) {
    return observer[handlerName] && observer[handlerName](payload);
  };
};

const getHandlerName = function({name}) {
  return `on${name}`;
};

const notifyAll = function<Result, Variables: void | Object>(
  observers: $ReadOnlyArray<Observer<Result, Variables>>,
  event: Event
) {
  return observers.forEach(getNotifier(getHandlerName(event), event.payload));
};

export default notifyAll;
