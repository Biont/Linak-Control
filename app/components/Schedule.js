// @flow
import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import Slider from 'material-ui/Slider';
import TimeInput from 'material-ui/TimePicker';
import IconButton from 'material-ui/IconButton';
import {Grid, Row, Col} from 'react-flexbox-grid';
import AddSVG from "material-ui/svg-icons/av/playlist-add.js";
import  RemoveSVG from "material-ui/svg-icons/action/delete.js";

import Settings from 'electron-settings';
import styles from './Schedule.css';
let noop = () => {
};
const newItemDefaults = {
    name: '',
    hours: '13',
    minutes: '37',
    height: 100
};
class Schedule extends Component {
    props: {
        onAdd: () => void,
        onUpdate: () => void,
        onRemove: () => void,
        items: React.PropTypes.array
    };

    static defaultProps = {
        ...Component.defaultProps,
        items: [
            {
                name: 'hurr',
                hours: '12',
                minutes: '00',
                height: 100
            },
            {
                name: 'durr',
                hours: '13',
                minutes: '00',
                height: 500
            }
        ],
        onAdd: noop,
        onUpdate: noop,
        onRemove: noop
    };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            lastItemValue: this.getNewItemDefaults()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({items: nextProps.items || []});
    }

    getNewItemDefaults() {
        return JSON.parse(JSON.stringify(newItemDefaults));
    }

    render() {
        let state = this.state || {};
        let rendered = [], items = state.items || [];
        items.concat(
            {
                name: '',
                hours: '13',
                minutes: '37',
                height: 100
            }
        ).map((item, idx) => {
            let newItem = idx === this.state.items.length,
                ref = newItem ? (ref) => {
                        this.newItemRef = ref;
                    } : "",
                date = new Date(), IconButton = (newItem) ? AddSVG : RemoveSVG,
                clickHandler = (newItem) ? this.addItem.bind(this) : this.removeItem.bind(this, idx);
            date.setHours(item.hours, item.minutes, 0, 0);

            rendered.push(
                <li
                    key={idx}
                    ref={ref}
                >
                    <Row className={styles.rowDivider}>
                        <Col xs={6} md={2}>
                            <TextField
                                id={'name-'+idx}
                                key={idx}
                                name={'name-'+idx}
                                defaultValue={item.name}
                                onChange={this.onNameChange.bind(this,idx)}
                                floatingLabelText="Name"
                                style={{flex:1}}
                            />
                        </Col>
                        <Col xs={6} md={2}>
                            <TimeInput
                                id={'time-'+idx}
                                key={idx}
                                format="24hr"
                                value={date}
                                onChange={(event, payload)=>{this.onTimeChange(idx,payload)}}
                                floatingLabelText="Time"
                                style={{flex:1}}
                            />
                        </Col>
                        <Col xs={10} md={5}>
                            <Slider
                                id={'height-'+idx}
                                key={idx}
                                name={'height-'+idx}
                                min={0}
                                max={1000}
                                defaultValue={1}
                                value={item.height}
                                onChange={this.onHeightChange.bind(this,idx)}
                                style={{flex:1}}
                            />
                        </Col>
                        <Col xs={2} md={3}>
                            <IconButton onClick={clickHandler}>{IconButton}</IconButton>
                        </Col>
                    </Row>
                </li>
            );
        });

        return (<ul>{rendered}</ul>);
    }

    onTimeChange(idx, date) {
        let items = this.state.items;
        items[idx]['hours'] = date.getHours();
        items[idx]['minutes'] = date.getMinutes();

        if (idx === this.state.items.length) {
            return this.setState({
                lastItemValue: {
                    ...this.state.lastItemValue,
                    hours: date.getHours(),
                    minutes: date.getMinutes()
                }
            });
        }
        this.setState({items});

        this.props.onUpdate(this.state.items);

    }

    onHeightChange(idx, event, height) {
        let items = this.state.items;
        items[idx]['height'] = height;
        if (idx === this.state.items.length) {
            this.setState({lastItemValue: {...this.state.lastItemValue, height: height}});
            return;
        }
        this.setState({items});
        this.props.onUpdate(this.state.items);

    }

    onNameChange(idx, event, name) {
        console.log(arguments);
        let items = this.state.items;
        items[idx]['name'] = name;
        if (idx === this.state.items.length) {
            this.setState({lastItemValue: {...this.state.lastItemValue, name: name}});
            return;
        }
        this.setState({items});
        this.props.onUpdate(this.state.items);
    }

    addItem() {
        let items = Array.from(this.state.items), newItem = JSON.parse(JSON.stringify(this.state.lastItemValue));
        this.props.onAdd(newItem);
        this.setState({
            items: items.concat(newItem),
            lastItemValue: this.getNewItemDefaults()
        });

    }

    removeItem(idx) {
        let items = Array.from(this.state.items);
        items.splice(idx, 1);
        this.setState({items});
        this.props.onRemove(idx);
    }
}

export default Schedule;
