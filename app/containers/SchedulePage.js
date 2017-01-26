import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Schedule from '../components/Schedule';
import * as ScheduleActions from '../actions/schedule';

function mapStateToProps(state) {
    console.log('This is the state', state);
    return {
        items: state.schedule || []
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ScheduleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);