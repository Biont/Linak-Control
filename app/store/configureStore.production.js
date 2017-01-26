// @flow
import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {hashHistory} from 'react-router';
import {routerMiddleware} from 'react-router-redux';
import rootReducer from '../reducers';
import {persistStore, autoRehydrate} from 'redux-persist';
import SettingsStorage from './settingsStorage';

import type {counterStateType} from '../reducers/counter';
import type {scheduleStateType} from '../reducers/schedule';

const router = routerMiddleware(hashHistory);

const enhancer = compose(applyMiddleware(thunk, router), autoRehydrate());

export default function configureStore(initialState?: scheduleStateType) {
    let store = createStore(rootReducer, undefined, enhancer); // eslint-disable-line
    persistStore(store, {storage: new SettingsStorage()});
    return store;
}
