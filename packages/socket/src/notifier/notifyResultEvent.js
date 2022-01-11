// @flow

import notifyActive from "./notifyActive";
import {createResultEvent} from "./event/eventCreators";

import type {Notifier} from "./types";

const notifyResultEvent = function<Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>,
  result: Result
) {
  return notifyActive(notifier, createResultEvent(result));
};

export default notifyResultEvent;
