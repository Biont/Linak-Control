//noinspection JSUnresolvedVariable
//TODO: We need to put l10n in a separate module and require it here. Short-circuit for now
let biontl10n = {};
/**
 * Helper functions to be used in ejs templates
 */
module.exports = {
	/**
	 * Checks if a localized string is present and returns it. Otherwise, returns the original string
	 *
	 * @param str
	 * @private
	 */
	_e: ( str ) => biontl10n[ str ] || str
}