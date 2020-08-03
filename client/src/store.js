import {createStore , applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initalState = {};

const middleware = [thunk];

//reducer:The reducer is a pure function that takes the previous state and an action, and returns the next state. 
//A store holds the whole state tree of your application. 
//The only way to change the state inside it is to dispatch an action on it.


const store = createStore(
  rootReducer,
  initalState,
  composeWithDevTools(applyMiddleware(...middleware))
  );

  export default store;
