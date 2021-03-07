import { ChannelActionsTypes } from './channel.types';

const INITIAL_STATE = {
	currentChannel: null,
};

const channelReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ChannelActionsTypes.SET_CURRENT_CHANNEL:
			return {
				...state,
				currentChannel: action.payload,
			};
		default:
			return state;
	}
};

export default channelReducer;
