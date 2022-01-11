// @flow

import observerNotifyAll from "./observer/notifyAll";

import type { Event, Notifier } from "./types";

const getObservers = function ({ activeObservers, canceledObservers }) {
  return [
    ...activeObservers,
    ...canceledObservers
  ];
}

const notify = function <Result, Variables: void | Object > (
  notifier: Notifier < Result, Variables >,
    event: Event
) {
  observerNotifyAll(getObservers(notifier), event);

  return notifier;
};

export default notify;
