// @flow

import observerNotifyAll from "./observer/notifyAll";

import type {Event, Notifier} from "./types";

const notifyCanceled = function<Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>,
  event: Event
) {
  observerNotifyAll(notifier.canceledObservers, event);

  return notifier;
};

export default notifyCanceled;
