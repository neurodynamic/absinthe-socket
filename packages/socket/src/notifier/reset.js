// @flow

import flushCanceled from "./flushCanceled";
import requestStatuses from "./requestStatuses";

import type { Notifier } from "./types";

const reset = function <Result, Variables: void | Object > (
  notifier: Notifier < Result, Variables >
) {
  return flushCanceled({
    ...notifier,
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  });
}

export default reset;
