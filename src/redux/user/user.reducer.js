import { UserActionsTypes } from './user.types';

const INITIAL_STATE = {
	currentUser: null,
	isLoading: true,
};

const userReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UserActionsTypes.SET_CURRENT_USER:
			return {
				...state,
				currentUser: action.payload,
				isLoading: false,
			};
		case UserActionsTypes.CLEAR_USER:
			return {
				...state,
				isLoading: false,
			};
		default:
			return state;
	}
};

export default userReducer;
