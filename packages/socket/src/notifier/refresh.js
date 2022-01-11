// @flow

import {replace as arrayReplace} from "@jumpn/utils-array";

import findIndex from "./findIndex";

import type {Notifier} from "./types";

const refresh = function(notifier: Notifier<any, any>) {
  return function(notifiers: Array<Notifier<any, any>>) {
    return arrayReplace(
      findIndex(notifiers, "request", notifier.request),
      [notifier],
      notifiers
    );
  };
};

export default refresh;
