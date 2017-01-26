import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {hashHistory} from 'react-router';
import {routerMiddleware, push} from 'react-router-redux';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

import {persistStore, autoRehydrate} from 'redux-persist'
import SettingsStorage from './settingsStorage';
import * as counterActions from '../actions/counter';
import type {counterStateType} from '../reducers/counter';
import * as scheduleActions from '../actions/schedule';
import type {scheduleStateType} from '../reducers/schedule';

const actionCreators = {
    // ...counterActions,
    ...scheduleActions,
    push,
};

const logger = createLogger({
    level: 'info',
    collapsed: true
});

const router = routerMiddleware(hashHistory);

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators,
    }) :
    compose;
/* eslint-enable no-underscore-dangle */
const enhancer = composeEnhancers(
    applyMiddleware(thunk, router, logger), autoRehydrate({log: true})
);

export default function configureStore(initialState?: scheduleStateType) {
    const store = createStore(rootReducer, undefined, enhancer);

    // persistStore(store, {storage: new SettingsStorage()});
    let persistor = persistStore(store);
    persistor.purge();
    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
        );
    }
    return store;
}
