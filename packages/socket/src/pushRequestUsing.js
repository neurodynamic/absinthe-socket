// @flow

import {requestToCompat} from "@jumpn/utils-graphql";

import abortNotifier from "./abortNotifier";
import notifierNotifyActive from "./notifier/notifyActive";
import pushAbsintheEvent from "./pushAbsintheEvent";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import {createAbsintheDocEvent} from "./absinthe-event/absintheEventCreators";
import {createErrorEvent} from "./notifier/event/eventCreators";

import type {AbsintheSocket, NotifierPushHandler} from "./types";
import type {Notifier} from "./notifier/types";

const pushAbsintheDocEvent = function(
  absintheSocket,
  {request},
  notifierPushHandler
) {
  return pushAbsintheEvent(
    absintheSocket,
    request,
    notifierPushHandler,
    createAbsintheDocEvent(requestToCompat(request))
  );
};

const setNotifierRequestStatusSending = function(absintheSocket, notifier) {
  return refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sending
  });
};

const createRequestError = function(message) {
  const error = new Error(`request: ${message}`);
  error.object = message;

  return error;
};

const onTimeout = function(absintheSocket, notifier) {
  return notifierNotifyActive(
    notifier,
    createErrorEvent(createRequestError("timeout"))
  );
};

const onError = function(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  errorMessage: string
) {
  return abortNotifier(
    absintheSocket,
    notifier,
    createRequestError(errorMessage)
  );
};

const getNotifierPushHandler = function(onSucceed) {
  return {onError, onSucceed, onTimeout};
};

const pushRequestUsing = function(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  onSucceed: $ElementType<NotifierPushHandler<any>, "onSucceed">
) {
  return pushAbsintheDocEvent(
    absintheSocket,
    setNotifierRequestStatusSending(absintheSocket, notifier),
    getNotifierPushHandler(onSucceed)
  );
};

export {pushRequestUsing as default, onError};
