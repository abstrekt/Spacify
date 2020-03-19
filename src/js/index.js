import * as Search from './model/Search';
import * as searchView from './view/searchView';
import * as type from './view/typewriter';
import {elements} from './view/base';
import '../css/style.css';
import 'particles.js';

const config = require('./particles.json');
particlesJS('particles-js', config, function() {
    // console.log('callback - particles.js config loaded');
  });

const state = {};

const controlSearch = async () => {
    const query = searchView.getInput();
    if (query) {
        state.search = new Search.SearchNasa(query);
        await state.search.getData(1);
        searchView.clearResults();
        searchView.clearInput();
        searchView.giveState(state.search);
        searchView.renderResults(state.search.data.items);
        if (state.search.data.metadata.total_hits == 0) {
            const markup = `<div class="face">(>_<)</b><p>nothing to show!</p></div>`;
            elements.searchResItems.innerHTML = markup;
            elements.totalhits.innerHTML = ``;
            elements.resultsShowing.innerHTML = ``;
            elements.totalhits.innerHTML =`No result found for query: "${query}". Try something else like "hello", "Andromeda".`;
            elements.prevPage.style.display = 'none';
            elements.nextPage.style.display = 'none';
            return;
        }
        searchView.resHeader(state.search.data.metadata.total_hits, state.search.query, state.search.data.items.length, state.search.pageNo);
    }
}

elements.nextPage.addEventListener('click', async () =>{
    state.search.pageNo += 1;
    elements.searchResItems.insertAdjacentHTML('beforeend', markup);
    await state.search.getData(state.search.pageNo);
    searchView.clearResults();
    searchView.giveState(state.search);
    searchView.renderResults(state.search.data.items);
    searchView.resHeader(state.search.data.metadata.total_hits, state.search.query, state.search.data.items.length, state.search.pageNo);
});

elements.prevPage.addEventListener('click', async () => {
    elements.searchResItems.insertAdjacentHTML('beforeend', markup);
    state.search.pageNo -= 1;
    await state.search.getData(state.search.pageNo);
    searchView.clearResults();
    searchView.giveState(state.search);
    searchView.renderResults(state.search.data.items);
    searchView.resHeader(state.search.data.metadata.total_hits, state.search.query, state.search.data.items.length, state.search.pageNo);
});

// IIFE
(async () => {
    state.apod = new Search.SearchAPOD();
    await state.apod.getAPOD();
    searchView.headerImg(state.apod.result);
  })();

elements.APODdownload.addEventListener('click', () => {
    elements.APODdownload.setAttribute("href", state.apod.result.hdurl);
});

elements.form.addEventListener('submit', e => {
    e.preventDefault();
    elements.typewriter.style.display = 'none';
    elements.html.style.scrollbarWidth = 'thin';
    controlSearch();
    elements.searchResItems.style.display = 'grid';
    elements.header.style.height = '8vh';
    elements.header.style.transition = '.5s ease';
    elements.headerDetails.style.display = 'none';
    elements.headerTitle.style.display = 'none';
    elements.headerArrow.style.display = 'none';
    elements.searchResItems.insertAdjacentHTML('beforeend', markup);
    elements.resultHeader.style.display = 'flex';
    elements.navigate.style.display = 'flex';
});

elements.header.addEventListener('click', e => {
    if(elements.header.clientHeight < 100) return;
    if (elements.header != e.target) return;
    searchView.headerPopup(state.apod.result);    
});

window.addEventListener('load', e => {
    e.preventDefault();
    type.typewriter();
    elements.preloader.style.display = 'none';
    elements.body.style.overflowY = 'visible';
});

const markup = `
<div id="preloader">
<i class="fas fa-meteor meteor"></i>
<div class="fire">
    <span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </span>
</div>
<div class='longfazers'>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>
</div>
`;