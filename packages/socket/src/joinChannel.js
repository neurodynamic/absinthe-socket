// @flow

import handlePush from "./handlePush";
import notifierNotifyActive from "./notifier/notifyActive";
import pushRequest from "./pushRequest";
import { createErrorEvent } from "./notifier/event/eventCreators";

import type { AbsintheSocket } from "./types";

const createChannelJoinError = message => new Error(`channel join: ${message}`);

const notifyErrorToAllActive = function (absintheSocket, errorMessage) {
  return absintheSocket.notifiers.forEach(function (notifier) {
    return notifierNotifyActive(
      notifier,
      createErrorEvent(createChannelJoinError(errorMessage))
    )
  }
  );
}
// join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356
const createChannelJoinHandler = function (absintheSocket) {
  return ({
    onError: function (errorMessage: string) {
      return notifyErrorToAllActive(absintheSocket, errorMessage)
    },

    onSucceed: function () {
      return absintheSocket.notifiers.forEach(notifier =>
        pushRequest(absintheSocket, notifier)
      )
    },

    onTimeout: function () { return notifyErrorToAllActive(absintheSocket, "timeout") }
  });
}
const joinChannel = function (absintheSocket: AbsintheSocket) {
  handlePush(
    absintheSocket.channel.join(),
    createChannelJoinHandler(absintheSocket)
  );

  absintheSocket.channelJoinCreated = true;

  return absintheSocket;
};

export default joinChannel;
