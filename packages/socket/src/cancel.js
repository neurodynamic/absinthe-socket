// @flow

import notifierCancel from "./notifier/cancel";
import notifierFlushCanceled from "./notifier/flushCanceled";
import notifierRefresh from "./notifier/refresh";
import notifierRemove from "./notifier/remove";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import { unsubscribe } from "./subscription";

import type { AbsintheSocket } from "./types";
import type { Notifier } from "./notifier/types";

const cancelQueryOrMutationSending = function (absintheSocket, notifier) {
  return updateNotifiers(
    absintheSocket,
    notifierRefresh(notifierFlushCanceled(notifierCancel(notifier)))
  );
}

const cancelQueryOrMutationIfSending = function (absintheSocket, notifier) {
  return notifier.requestStatus === requestStatuses.sending
    ? cancelQueryOrMutationSending(absintheSocket, notifier)
    : absintheSocket;
}

const cancelPending = function (absintheSocket, notifier) {
  return updateNotifiers(
    absintheSocket,
    notifierRemove(notifierFlushCanceled(notifierCancel(notifier)))
  );
}

const cancelQueryOrMutation = function (absintheSocket, notifier) {
  return notifier.requestStatus === requestStatuses.pending
    ? cancelPending(absintheSocket, notifier)
    : cancelQueryOrMutationIfSending(absintheSocket, notifier);
}

const unsubscribeIfNeeded = function (absintheSocket, notifier) {
  return notifier.requestStatus === requestStatuses.sent
    ? unsubscribe(absintheSocket, notifier)
    : absintheSocket;
}

const cancelNonPendingSubscription = function (absintheSocket, notifier) {
  return unsubscribeIfNeeded(
    absintheSocket,
    refreshNotifier(absintheSocket, notifierCancel(notifier))
  );
}

const cancelSubscription = function (absintheSocket, notifier) {
  return notifier.requestStatus === requestStatuses.pending
    ? cancelPending(absintheSocket, notifier)
    : cancelNonPendingSubscription(absintheSocket, notifier);
}

const cancelActive = function (absintheSocket, notifier) {
  return notifier.operationType === "subscription"
    ? cancelSubscription(absintheSocket, notifier)
    : cancelQueryOrMutation(absintheSocket, notifier);
}

/**
 * Cancels a notifier sending a Cancel event to all its observers and
 * unsubscribing in case it holds a subscription request
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.cancel(absintheSocket, notifier);
 */
const cancel = function (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>
): AbsintheSocket {
  return notifier.isActive ? cancelActive(absintheSocket, notifier) : absintheSocket;
}

export default cancel;
