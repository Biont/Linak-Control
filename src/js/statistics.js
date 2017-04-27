export default class Statistics {
	constructor( settings, settingsKey ) {
		this.settings = settings;
		this.settingsKey = settingsKey;
		this.data = this.settings.get( settingsKey ) || {};
	}

	addHeightTime( key, value ) {
		if ( !this.data[ key ] ) {
			this.data[ key ] = value;
		} else {
			this.data[ key ] += value;
		}
	}

	getData() {
		return this.data;
	}

	save() {
		this.settings.set( this.settingsKey, this.data );
	}
}