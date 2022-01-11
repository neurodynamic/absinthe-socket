// @flow

import type { Notifier, Observer } from "./types";

const observe = function <Result, Variables: void | Object > (
  { activeObservers, ...rest }: Notifier < Result, Variables >,
    observer: Observer < Result, Variables >
) {
  return ({
    ...rest,
    activeObservers: [...activeObservers, observer],
    isActive: true
  });
}

export default observe;
