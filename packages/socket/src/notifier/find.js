// @flow

import { hasIn } from "@jumpn/utils-composite";

import type { Notifier } from "./types";

const find = function (notifiers: Array<Notifier<any, any>>, key: string, value: any) {
  // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
  return notifiers.find(hasIn([key], value));
}

export default find;
