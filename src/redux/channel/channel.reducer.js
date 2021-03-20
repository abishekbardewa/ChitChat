import { ChannelActionsTypes } from './channel.types';

const INITIAL_STATE = {
	currentChannel: null,
	isPrivateChannel: false,
	userPosts: null,
};

const channelReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ChannelActionsTypes.SET_CURRENT_CHANNEL:
			return {
				...state,
				currentChannel: action.payload,
			};
		case ChannelActionsTypes.SET_PRIVATE_CHANNEL:
			return {
				...state,
				isPrivateChannel: action.payload,
			};
		case ChannelActionsTypes.SET_USER_POSTS:
			return {
				...state,
				userPosts: action.payload,
			};
		default:
			return state;
	}
};

export default channelReducer;
