import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import rootReducer from './root-reducer';

const middleWare = [];

if (process.env.NODE_ENV === 'development') {
	middleWare.push(logger);
}
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleWare)));
export default store;
