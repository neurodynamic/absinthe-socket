// @flow

import notifierRefresh from "./notifier/refresh";
import updateNotifiers from "./updateNotifiers";

import type { AbsintheSocket } from "./types";
import type { Notifier } from "./notifier/types";

const refreshNotifier = function <Result, Variables: void | Object > (
  absintheSocket: AbsintheSocket,
    notifier: Notifier < Result, Variables >
) {
  updateNotifiers(absintheSocket, notifierRefresh(notifier));

  return notifier;
};

export default refreshNotifier;
