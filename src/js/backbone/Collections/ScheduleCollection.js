import PersistentDataCollection from "./PersistentDataCollection";

export default class ScheduleCollection extends PersistentDataCollection.extend( {} ) {
	constructor( models, options ) {
		super( models, options );
	}
};