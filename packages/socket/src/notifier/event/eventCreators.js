// @flow

import eventNames from "./eventNames";

import type {
  AbortEvent,
  CancelEvent,
  ErrorEvent,
  Notifier,
  ResultEvent,
  StartEvent
} from "../types";

const createStartEvent = function <Payload: Notifier< any, any>> (
  payload: Payload
): StartEvent < Payload > { return({ payload, name: eventNames.start });}

const createResultEvent = function <Result>(payload: Result): ResultEvent<Result> {
  return ({
    payload,
    name: eventNames.result
  });
}

const createErrorEvent = function (payload: Error): ErrorEvent {
  return ({
    payload,
    name: eventNames.error
  });
}

const createCancelEvent = function (): CancelEvent {
  return ({
    name: eventNames.cancel,
    payload: undefined
  });
}

const createAbortEvent = function (payload: Error): AbortEvent {
  return ({
    payload,
    name: eventNames.abort
  });
}

export {
  createStartEvent,
  createResultEvent,
  createErrorEvent,
  createCancelEvent,
  createAbortEvent
};
