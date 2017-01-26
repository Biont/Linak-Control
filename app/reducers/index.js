// @flow
import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import counter from './counter';
import schedule from './schedule';

const rootReducer = combineReducers({
    counter,
    schedule,
    routing
});

export default rootReducer;
