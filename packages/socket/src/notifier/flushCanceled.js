// @flow

import notifyCanceled from "./notifyCanceled";
import { createCancelEvent } from "./event/eventCreators";

import type { Notifier } from "./types";

const clearCanceled = function (notifier) {
  return ({
    ...notifier,
    canceledObservers: []
  });
}

const flushCanceled = function <Result: any, Variables: void | Object > (
  notifier: Notifier < Result, Variables >
) {
  return notifier.canceledObservers.length > 0
    ? clearCanceled(notifyCanceled(notifier, createCancelEvent()))
    : notifier;
}

export default flushCanceled;
