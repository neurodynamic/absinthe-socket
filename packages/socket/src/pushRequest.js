// @flow

import type { GqlResponse } from "@jumpn/utils-graphql/compat/cjs/types";

import notifierNotifyResultEvent from "./notifier/notifyResultEvent";
import notifierNotifyStartEvent from "./notifier/notifyStartEvent";
import notifierRemove from "./notifier/remove";
import pushRequestUsing from "./pushRequestUsing";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import { subscribe } from "./subscription";

import type { AbsintheSocket } from "./types";
import type { Notifier } from "./notifier/types";

const setNotifierRequestStatusSent = function (absintheSocket, notifier) {
  return refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sent
  });
}

const onQueryOrMutationSucceed = function (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  response: GqlResponse<any>
) {
  return updateNotifiers(
    absintheSocket,
    notifierRemove(
      notifierNotifyResultEvent(
        setNotifierRequestStatusSent(absintheSocket, notifier),
        response
      )
    )
  );
}

const pushQueryOrMutation = function (absintheSocket, notifier) {
  return pushRequestUsing(
    absintheSocket,
    notifierNotifyStartEvent(notifier),
    onQueryOrMutationSucceed
  );
}

const pushRequest = function (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>
) {
  if (notifier.operationType === "subscription") {
    subscribe(absintheSocket, notifier);
  } else {
    pushQueryOrMutation(absintheSocket, notifier);
  }
};

export default pushRequest;
