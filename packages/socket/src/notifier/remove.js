// @flow

import { remove as arrayRemove } from "@jumpn/utils-array";

import findIndex from "./findIndex";

import type { Notifier } from "./types";

const remove = function (notifier: Notifier<any, any>) {
  return function (
    notifiers: Array<Notifier<any, any>>
  ) {
    return arrayRemove(findIndex(notifiers, "request", notifier.request), 1, notifiers);
  }
}
export default remove;
