// @flow

import { getOperationType } from "@jumpn/utils-graphql";

import type { GqlRequest } from "@jumpn/utils-graphql/compat/cjs/types";

import requestStatuses from "./requestStatuses";

import type { Notifier } from "./types";

const createUsing = function (request, operationType) {
  return ({
    operationType,
    request,
    activeObservers: [],
    canceledObservers: [],
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  });
}

const create = function <Variables: void | Object > (
  request: GqlRequest < Variables >
    ): Notifier < any, $Subtype < Variables >> {
  return createUsing(request, getOperationType(request.operation));
}

export default create;
