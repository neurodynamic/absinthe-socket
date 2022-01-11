// @flow

import type { Notifier } from "./types";

const reactivate = function <Result, Variables: void | Object > (
  notifier: Notifier < Result, Variables >
) { return (notifier.isActive ? notifier : { ...notifier, isActive: true }); }

export default reactivate;
