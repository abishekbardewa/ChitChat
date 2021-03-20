import { ColorsActionsTypes } from './colors.types';

export const setColors = (primaryColor, secondaryColor) => ({
	type: ColorsActionsTypes.SET_COLORS,
	payload: { primaryColor, secondaryColor },
});
