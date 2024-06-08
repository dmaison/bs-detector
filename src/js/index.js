let wordCount = 0,
bsCount = 0;

const BASE = 'bs-detector';

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

/**
 * Denotes emphasized speech. Denotes words and phrases that can easily be misinterpretted due to bias and other things
 * @type {string}
 */
const EMPHASIS = `${BASE}__emphasis`;

/**
 * Denotes hyperbolic speech. This includes unnecessary descriptive words made to exaggerate or impact how you perceive the information 
 * @type {string}
 */
const SUGGESTIVE = `${BASE}__suggestive`;

/**
 * Denotes speculative speech. This includes predictions or uncertain information 
 * @type {string}
 */
const SPECULATION = `${BASE}__speculation`;

/**
 * Array of words that require emphasis
 * @type {array}
 */
const WORDS_EMPHASIZE = [
    "alleged",
    "allegedly",
    "hypothetical",
    "hypothetically",
    "real",
];

/**
 * Array of speculative words
 * @type {array}
 */
const WORDS_SUGGESTIVE = [
    "cataclysmic",
    "chaotic",
    "conspiracy theory",
    "extraordinary",
    "independent",
    "largely",
    "purely",
    "really",
    "remarkable",
    "shameful",
    "slight", 
    "truly",
    "tumultuous",
    "unprecedented",
    "ultimate"
];

/**
 * Array of speculative words
 * @type {array}
 */
const WORDS_SPECULATIVE = [
    "assume", 
    "assumption", 
    "assuming",
    "believe", 
    "consider", 
    "could", 
    "estimate", 
    "guess",
    "is going to",
    "imagine", 
    "in all likelihood",
    "likely",
    "may be",
    "may become",
    "may feel",
    "may prove",
    "might", 
    "possibly", 
    "probably", 
    "speculate", 
    "suggest", 
    "think",
    "unlikely",
    "will be",
    "would have",
];

/**
 * Checks a string for speech that requires emphasis
 * @param {string} sentence 
 * @returns {string|HTMLElement} 
 */
const checkForUnemphasized = ( sentence ) => {
	const reg = new RegExp( `\\b(${ WORDS_EMPHASIZE.join( '|' ) })\\b`, 'gi' ),
    { value: matches=[] } = sentence.matchAll( reg ).next();
    matches.forEach(( term ) => {
        sentence = sentence.replace( term, wrapInElement( term, EMPHASIS ).outerHTML )
    });
    bsCount += matches.length;
	return sentence;
}

/**
 * Checks a string for speculative speech
 * @param {string} sentence 
 * @returns {string|HTMLElement} 
 */
const checkForSpeculation = ( sentence ) => {
	const reg = new RegExp( `\\b(${ WORDS_SPECULATIVE.join( '|' ) })\\b`, 'i' );
    if( reg.test( sentence ) ){
        bsCount += sentence.split( ' ' ).length;
        return wrapInElement( sentence, SPECULATION ).outerHTML;
    } else {
        return sentence;
    }
}

/**
 * Checks a string for suggestive speech
 * @param {string} sentence 
 * @returns {string|HTMLElement} 
 */
const checkForSuggestion = ( sentence ) => {
	const reg = new RegExp( `\\b(${ WORDS_SUGGESTIVE.join( '|' ) })\\b`, 'gi' ),
    { value: matches=[] } = sentence.matchAll( reg ).next();
    matches.forEach(( term ) => {
        sentence = sentence.replace( term, wrapInElement( term, SUGGESTIVE ).outerHTML )
    });

    bsCount += matches.length;
	return sentence;
}

/**
 * Executes the code when ready
 * @param {function} cb callback function for when the document is ready
 */
const DOMReady = ( cb ) => {
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
const getSentences = ( elem ) => {
	const { textContent } = elem,
	sentences = textContent.split( '.' );
    wordCount += textContent.split( ' ' ).length;
	return sentences;
}

/**
 * Retrieve elements that contain article text nodes
 */
const getElems = () => {
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
 * @param {string} elem Element tag name to wrap the content in
 * @returns {HTMLElement} Wrapped text
 */
const wrapInElement = ( str, className, elem = 'span' ) => {
	const span = document.createElement( elem );
	span.className = `${ BASE } ${ className }`;
	span.innerHTML = str;
	return span;
}

const createMeter = () => {
    const quarter = Math.floor( wordCount / 4 ),
    container = wrapInElement( 
        `
            <label for="bs-rating">BS Rating</label>
            <meter 
                id="bs-rating" 
                min="0"
                low="${ quarter }"
                optimum="${ ( Math.floor( wordCount / 2 ) ) }"
                high="${ ( Math.floor( wordCount / 2 ) ) + quarter }"
                value="${ bsCount }" 
                max="${ wordCount }">
            </meter>
        `, 
        'bs-meter', 
        'div' 
    );

    document.body.appendChild( container );
}

/**
 * Runs the bs detector
 */
const init = () => {
    const elems = getElems();

    elems.forEach(( elem ) => {
        const sentences = getSentences( elem ).map(( elem ) => {
            return pipe( checkForSpeculation, checkForSuggestion, checkForUnemphasized )( elem ) 
        });
        elem.innerHTML = sentences.join( '.' );
    });

    createMeter();
    
}

DOMReady( init );
    