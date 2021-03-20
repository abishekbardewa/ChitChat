import { ChannelActionsTypes } from './channel.types';

export const setCurrentChannel = (channel) => ({
	type: ChannelActionsTypes.SET_CURRENT_CHANNEL,
	payload: channel,
});

export const setPrivateChannel = (isPrivateChannel) => ({
	type: ChannelActionsTypes.SET_PRIVATE_CHANNEL,
	payload: isPrivateChannel,
});

export const setUserPosts = (userPosts) => ({
	type: ChannelActionsTypes.SET_USER_POSTS,
	payload: userPosts,
});
