import {find} from "underscore";

export default class SchedulerLogic {
	constructor( schedule, subscribers ) {
		this.schedule = schedule;
		this.setData( schedule );
		this.subscribers = subscribers;
		console.log( this.schedule );
	}

	setData( schedule ) {
		// console.log(schedule);
		this.schedule = schedule;
		this.cmpDate = this.setCmpDateToNow();

	}

	scheduleEmpty() {
		return !this.schedule || Object.keys( this.schedule ).length === 0 && this.schedule.constructor === Object;
	}

	getTimeDifference( nextItem ) {

		// console.log('NextItem!', nextItem);
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
		let dateObj = new Date( this.cmpDate );
		dateObj.setHours( data[ 0 ] );
		dateObj.setMinutes( data[ 1 ] );
		dateObj.setSeconds( '00' );

		return dateObj.getTime();
	}

	dequeue() {
		this.clearTimeouts();
	}

	enqueue() {
		if ( this.scheduleEmpty() ) {
			console.log( 'Nothing on schedule. Phew!   ...wait, is this good?' );
			return;
		}
		this.clearTimeouts();

		let diff;
		let nextItem = this.getNextScheduleItem();
		if ( diff = this.getTimeDifference( nextItem ) ) {
			this.subscribers.forEach( ( element, index, array ) => {
				let subscription = diff + element.delay;
				element.curTimeout = setTimeout( () => element.callback( nextItem ), subscription );
			} );
			this.privTimeout = setTimeout( () => {
				this.setCmpDateToNow();
				this.enqueue()
			}, diff + 100 );
		} else {
			console.log( 'nothing left to do for today' );
			this.setCmpDateToTomorrow();
			this.enqueue();
		}
	}

	setCmpDateToNow() {
		return this.cmpDate = (
			new Date()
		).getTime();
	}

	clearTimeouts() {
		//Cleanup
		if ( this.privTimeout ) {
			clearTimeout( this.privTimeout );

		}
		this.subscribers.forEach( ( element, index, array ) => {
			if ( element.curTimeout ) {
				clearTimeout( element.curTimeout );
			}
		} );
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