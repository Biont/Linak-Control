import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {onAdd,onChange} from './actions/schedule';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);
// store.dispatch(onAdd({
//     name: '',
//     hours: '13',
//     minutes: '37',
//     height: 100
// }));
render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Provider store={store}>
            <Router history={history} routes={routes}/>
        </Provider>
    </MuiThemeProvider>
    ,
    document.getElementById('root')
);
