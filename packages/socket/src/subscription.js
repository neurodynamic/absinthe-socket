// @flow

import { errorsToString as gqlErrorsToString } from "@jumpn/utils-graphql";

import type {
  GqlError,
  GqlResponse
} from "@jumpn/utils-graphql/compat/cjs/types";
import type { Message } from "phoenix";

import abortNotifier from "./abortNotifier";
import notifierFind from "./notifier/find";
import notifierFlushCanceled from "./notifier/flushCanceled";
import notifierNotifyCanceled from "./notifier/notifyCanceled";
import notifierNotifyResultEvent from "./notifier/notifyResultEvent";
import notifierNotifyStartEvent from "./notifier/notifyStartEvent";
import notifierRemove from "./notifier/remove";
import notifierReset from "./notifier/reset";
import pushAbsintheEvent from "./pushAbsintheEvent";
import pushRequestUsing, { onError } from "./pushRequestUsing";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import { createAbsintheUnsubscribeEvent } from "./absinthe-event/absintheEventCreators";
import { createErrorEvent } from "./notifier/event/eventCreators";

import type { AbsintheSocket, NotifierPushHandler } from "./types";
import type { Notifier } from "./notifier/types";

type SubscriptionPayload<Data> = {|
  result: GqlResponse < Data >,
    subscriptionId: string
      |};

// TODO: improve this type
type UnsubscribeResponse = {};

type SubscriptionResponse =
  | {| subscriptionId: string |}
  | {| errors: Array < GqlError >|};

const onUnsubscribeSucceedCanceled = function (absintheSocket, notifier) {
  return updateNotifiers(
    absintheSocket,
    notifierRemove(notifierFlushCanceled(notifier))
  );
}

const onUnsubscribeSucceedActive = function (absintheSocket, notifier) {
  return subscribe(
    absintheSocket,
    refreshNotifier(absintheSocket, notifierReset(notifier))
  );
}
const createUnsubscribeError = function (message) { return new Error(`unsubscribe: ${message}`); }

const unsubscribeHandler: NotifierPushHandler<UnsubscribeResponse> = {
  onError: function (absintheSocket, notifier, errorMessage) {
    return abortNotifier(
      absintheSocket,
      notifier,
      createUnsubscribeError(errorMessage)
    )
  },

  onTimeout: function (absintheSocket, notifier) {
    return notifierNotifyCanceled(
      notifier,
      createErrorEvent(createUnsubscribeError("timeout"))
    )
  },

  onSucceed: function (absintheSocket, notifier) {
    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier);
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier);
    }
  }
};

const pushAbsintheUnsubscribeEvent = function (
  absintheSocket,
  { request, subscriptionId }
) {
  return pushAbsintheEvent(
    absintheSocket,
    request,
    unsubscribeHandler,
    createAbsintheUnsubscribeEvent({ subscriptionId })
  );
}
const unsubscribe = function (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>
) {
  return pushAbsintheUnsubscribeEvent(
    absintheSocket,
    refreshNotifier(absintheSocket, {
      ...notifier,
      requestStatus: requestStatuses.canceling
    })
  );
}

const onSubscribeSucceed = function (absintheSocket, notifier, { subscriptionId }) {
  const subscribedNotifier = refreshNotifier(absintheSocket, {
    ...notifier,
    subscriptionId,
    requestStatus: requestStatuses.sent
  });

  if (subscribedNotifier.isActive) {
    notifierNotifyStartEvent(subscribedNotifier);
  } else {
    unsubscribe(absintheSocket, subscribedNotifier);
  }
};

const onSubscribe = function (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  response: SubscriptionResponse
) {
  if (response.errors) {
    onError(absintheSocket, notifier, gqlErrorsToString(response.errors));
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response);
  }
};

const subscribe = function <Result, Variables: void | Object > (
  absintheSocket: AbsintheSocket,
    notifier: Notifier < Result, Variables >
) { return pushRequestUsing(absintheSocket, notifier, onSubscribe); }

const onDataMessage = function (
  absintheSocket: AbsintheSocket,
  { payload }: Message<SubscriptionPayload<any>>
) {
  const notifier = notifierFind(
    absintheSocket.notifiers,
    "subscriptionId",
    payload.subscriptionId
  );

  if (notifier) {
    notifierNotifyResultEvent(notifier, payload.result);
  }
};

const dataMessageEventName = "subscription:data";

const isDataMessage = function (message: Message<>) {
  return message.event === dataMessageEventName;
}

export { isDataMessage, onDataMessage, subscribe, unsubscribe };

export type { SubscriptionPayload };
