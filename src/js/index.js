import { DOMReady, getSentences, getElems, checkForSpeculation } from "./util";
import '../css/style.css'


const init = () => {
    const elems = getElems();

    elems.forEach(( elem ) => {
        const sentences = getSentences( elem ).map( checkForSpeculation );
        elem.innerHTML = sentences.join( '.' );
    });
    

}

DOMReady( init );