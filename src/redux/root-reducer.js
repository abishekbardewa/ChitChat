import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import channelReducer from './channel/channel.reducer';
import colorsReducer from './colors/colors.reducer';

const rootReducer = combineReducers({
	user: userReducer,
	channel: channelReducer,
	colors: colorsReducer,
});

export default rootReducer;
