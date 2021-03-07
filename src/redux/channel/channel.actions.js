import { ChannelActionsTypes } from './channel.types';

export const setCurrentChannel = (channel) => ({
	type: ChannelActionsTypes.SET_CURRENT_CHANNEL,
	payload: channel,
});
