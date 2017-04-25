import {find} from "underscore";

export default class SchedulerLogic {
	constructor( schedule, subscribers ) {
		this.schedule = schedule;
		this.setData( schedule );
		this.subscribers = subscribers;
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
		return find( this.schedule, ( model ) => this.getItemTimestamp( model ) > this.cmpDate );
	}

	getItemTimestamp( item ) {
		let data = item.time.split( ':' );
		let dateObj = new Date();
		dateObj.setHours( data[ 0 ] );
		dateObj.setMinutes( data[ 1 ] );
		dateObj.setSeconds( '00' );

		return dateObj.getTime();
	}

	enqueue() {

		//Cleanup
		this.subscribers.forEach( ( element, index, array ) => {
			if ( element.curTimeout ) {
				clearInterval( this.curTimeout );
			}
		} );

		let diff;
		let nextItem = this.getNextScheduleItem();
		if ( diff = this.getTimeDifference( nextItem ) ) {
			this.subscribers.forEach( ( element, index, array ) => {
				let subscription = diff + element.delay;
				element.curTimeout = setTimeout( () => element.callback( nextItem ), subscription );
			} );

		} else {
			console.log( 'nothing left to do for today' );
			this.setCmpDateToTomorrow();
		}
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