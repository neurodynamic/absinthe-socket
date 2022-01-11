// @flow

import {map} from "@jumpn/utils-composite";

import type {GqlRequest} from "@jumpn/utils-graphql/compat/cjs/types";

import handlePush from "./handlePush";
import notifierFind from "./notifier/find";

import type {AbsintheEvent} from "./absinthe-event/types";
import type {AbsintheSocket, NotifierPushHandler} from "./types";

const getPushHandlerMethodGetter = function(absintheSocket, request) {
  return function(handle) {
    return function(...args) {
      const notifier = notifierFind(
        absintheSocket.notifiers,
        "request",
        request
      );

      if (notifier) {
        handle(absintheSocket, notifier, ...args);
      }
    };
  };
};

const getPushHandler = function(absintheSocket, request, notifierPushHandler) {
  return map(
    getPushHandlerMethodGetter(absintheSocket, request),
    notifierPushHandler
  );
};

const pushAbsintheEvent = function<Variables: void | Object, Response: Object>(
  absintheSocket: AbsintheSocket,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler<Response>,
  absintheEvent: AbsintheEvent
) {
  handlePush(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler)
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
