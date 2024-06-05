import speculativeWords from '../json/speculative.json';
import { BASE, SPECULATION } from './constants';

/**
 * Checks a string for speculative speech
 * @param {string} sentence 
 * @returns {string|HTMLElement} 
 */
export const checkForSpeculation = ( sentence ) => {
	const reg = new RegExp( `\\b(${ speculativeWords.join( '|' ) })\\b`, 'i' );
	return reg.test( sentence ) ? wrapInElement( sentence, SPECULATION ).outerHTML : sentence;
}

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

/**
 * Retrieve the sentences from a particular element
 * @param {HTMLElement} elem
 */
export const getSentences = ( elem ) => {
	const { textContent } = elem,
	sentences = textContent.split( '.' );
	return sentences;
}

/**
 * Retrieve elements that contain article text nodes
 */
export const getElems = () => {
	const main = document.querySelector( 'main' ),
	walker = document.createTreeWalker( 
		main, 
		NodeFilter.SHOW_TEXT,
		( node ) => {
			const { textContent } = node;
			return /^[\w\s]{1,}$/gi.test( textContent ) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
		}
	),
	ary = [];

	while( walker.nextNode() ){
		const { currentNode: node } = walker;
		ary.push( node.parentElement );
	}

	return ary;
}

/**
 * Wraps provided string in an element with the branded class
 * @param {string} str Text content to be wrapped
 * @param {string} className Classname to add to the wrapper
 * @returns {HTMLElement} Wrapped text
 */
export const wrapInElement = ( str, className ) => {
	const span = document.createElement( 'span' );
	span.className = `${ BASE } ${ className }`;
	span.innerHTML = str;
	return span;
}