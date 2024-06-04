/**
 * Executes the code when ready
 * @param {function} cb callback function for when the document is ready
 */
export const DOMReady = ( cb ) => {
	if ( document.readyState === 'complete' || document.readyState === 'interactive' ) {
		cb();
	} else {
		document.addEventListener( 'DOMContentLoaded', cb );
	}
};