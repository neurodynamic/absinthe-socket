// @flow

import absintheEventNames from "./absintheEventNames";

import type {AbsintheDocEvent, AbsintheUnsubscribeEvent} from "./types";

const createAbsintheUnsubscribeEvent = function(
  payload: $ElementType<AbsintheUnsubscribeEvent, "payload">
): AbsintheUnsubscribeEvent {
  return {
    payload,
    name: absintheEventNames.unsubscribe
  };
};

const createAbsintheDocEvent = function<Variables: void | Object>(
  payload: $ElementType<AbsintheDocEvent<Variables>, "payload">
): AbsintheDocEvent<Variables> {
  return {
    payload,
    name: absintheEventNames.doc
  };
};

export {createAbsintheDocEvent, createAbsintheUnsubscribeEvent};
