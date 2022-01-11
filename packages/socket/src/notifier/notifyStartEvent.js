// @flow

import notifyActive from "./notifyActive";
import {createStartEvent} from "./event/eventCreators";

import type {Notifier} from "./types";

const notifyStartEvent = function<Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>
) {
  return notifyActive(notifier, createStartEvent(notifier));
};

export default notifyStartEvent;
