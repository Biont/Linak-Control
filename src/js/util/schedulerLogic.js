import Linak from "./linakUtil.js";
import {find} from "underscore";

export default class SchedulerLogic {
	constructor( schedule, linak ) {
		this.schedule = schedule;
		this.setData( schedule );
		this.linak = linak || new Linak();
		this.cmpDate = this.setCmpDateToNow();
		console.log( this.schedule );
	}

	setData( schedule ) {
		this.schedule = schedule;

	}

	boot() {

		return this.enqueue();

	}

	getTimeDifference( nextItem ) {

		console.log( 'NextItem!', nextItem );
		if ( nextItem ) {
			return this.getItemTimestamp( nextItem ) - this.cmpDate;
		}
		return false;
	}

	getNextScheduleItem() {
		console.log( this.schedule );
		return find( this.schedule, ( model ) => {
			console.log( 'CALLBACK!' );
			console.log( 'this', this.getItemTimestamp( model ) );
			console.log( 'cmpDate', this.cmpDate );
			return this.getItemTimestamp( model ) > this.cmpDate;
		} );
	}

	getItemTimestamp( item ) {
		console.log( 'next timestamp of....', item );
		let data = item.time.split( ':' );
		let dateObj = new Date();
		dateObj.setHours( data[ 0 ] );
		dateObj.setMinutes( data[ 1 ] );
		dateObj.setSeconds( '00' );

		return dateObj.getTime();
	}

	enqueue() {

		//Cleanup
		if ( this.curTimeout ) {
			clearInterval( this.curTimeout );
		}
		let diff;
		let nextItem = this.getNextScheduleItem();
		if ( diff = this.getTimeDifference( nextItem ) ) {
			console.log( 'setting new timeout', diff );
			this.curTimeout = setTimeout( () => this.timeout( nextItem ), diff );

		} else {
			console.log( 'nothing left to do for today' );
			this.setCmpDateToTomorrow();
		}
	}

	timeout( item ) {
		this.setCmpDateToNow();
		console.log( 'Scheduler firing' );
		this.linak.moveTo( item.height, () => {
			console.log( 'Linak done firing' );

		} );
		this.enqueue();
	}

	setCmpDateToNow() {
		return this.cmpDate = (
			new Date()
		).getTime();
	}

	setCmpDateToTomorrow() {
		this.cmpDate = this.getTomorrowsDate();
	}

	getTomorrowsDate() {
		// sleep(1000*60*60*24);
		// getCurrentDate();
		let time = new Date();
		time.setHours( '00' );
		time.setMinutes( '00' );
		time.setSeconds( '00' );
		time.setDate( time.getDate() + 1 );
		return time.getTime();
	}
}