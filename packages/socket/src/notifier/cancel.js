// @flow

import type { Notifier } from "./types";

const cancel = function <Result, Variables: void | Object > ({
  activeObservers,
  canceledObservers,
  ...rest
}: Notifier < Result, Variables >) {
  return ({
    ...rest,
    isActive: false,
    activeObservers: [],
    canceledObservers: [...activeObservers, ...canceledObservers]
  });
}

export default cancel;
