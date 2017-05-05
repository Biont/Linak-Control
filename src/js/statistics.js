export default class Statistics {
	constructor( settings, dataKey ) {
		this.settings = settings;
		this.dataKey = dataKey;
		this.settingsKey = 'AppSettings.mainApp.enableStatistics';
		this.data = this.settings.get( dataKey ) || {};
	}

	isEnabled() {
		return this.settings.get( this.settingsKey + '.enableStatistics' );
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
		this.settings.set( this.dataKey, this.data );
	}
}