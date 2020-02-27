import {elements} from './base';
import axios  from 'axios';


export const getInput = () => elements.searchInput.value;

const renderImage = image => {
    const markup = `
        <div class="image" id="${image.data[0].nasa_id}" style=" background: url(https://images-assets.nasa.gov/image/${image.data[0].nasa_id}/${image.data[0].nasa_id}~thumb.jpg) rgba(71, 63, 78, .54)"></div> 
    `;
    elements.searchResItems.insertAdjacentHTML('beforeend', markup);
}

export const renderResults  = images => {
    images.forEach(renderImage);
}

export const resHeader = (totalhits, query, resLength, pageNo) =>{
    let start = 1 + ((pageNo - 1) * 100);
    let stop = resLength + ((pageNo - 1) * 100);
    const lastPage = Math.floor(totalhits/100);
    if (lastPage == 0){
        elements.prevPage.style.display = 'none';
        elements.nextPage.style.display = 'none';
    }else if(pageNo == 1){
        elements.prevPage.style.display = 'none';
        elements.nextPage.style.display = 'block';
        elements.nextPage.innerHTML = '<i class="fas fa-caret-right"></i>';
    }else if(pageNo == lastPage+1){
        elements.prevPage.style.display = 'block';
        elements.nextPage.style.display = 'none';
        elements.prevPage.innerHTML = '<i class="fas fa-caret-left"></i>';
    }else{
        elements.prevPage.style.display = 'block';
        elements.nextPage.style.display = 'block';
        elements.nextPage.innerHTML = '<i class="fas fa-caret-right"></i>';
        elements.prevPage.innerHTML = '<i class="fas fa-caret-left"></i>';
    }
    elements.totalhits.innerHTML = `Total hits: ${totalhits}`;
    elements.resultsShowing.innerHTML =`Showing ${start}-${stop} out of ${totalhits} for query: "${query}"`;
}


export const headerImg = apod => {
    if(apod.media_type == "video"){
        const style = `linear-gradient(180deg, #15141200 0%, #2B2F2D33 29%, #101110 100%) center/cover`;
        elements.header.style.background = style;
        const iframe = `<iframe src="${apod.url}?vq=hd1080&autoplay=1&loop=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1" width="100%" height="100%" frameborder="0"></iframe>`;
        elements.header.innerHTML = iframe;
    }else{
        const style = `linear-gradient(180deg, #15141200 0%, #2B2F2D33 29%, #101110 100%), url(${apod.url}) center/cover`;
        elements.header.style.background = style;
    }
    elements.headerTitle.innerHTML = apod.title;
    elements.headerDetails.innerHTML = `<q>${apod.explanation}</q>`;
};

export const headerPopup = apod =>{
    if(apod.media_type == "video"){
        elements.header__popupImg.innerHTML = `<iframe src="${apod.url}?vq=hd1080&autoplay=1&loop=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1" width="100%" height="100%" frameborder="0"></iframe>`; 
        elements.header__popup.style.display = 'flex'; 
    }else{
        elements.header__popupImg.style.background = `url(${apod.url}) center/contain no-repeat`; 
        elements.header__popup.style.display = 'flex'; 
    }
};


export const clearInput = () => {
    elements.searchInput.value = ``;
};

export const clearResults = () =>{
    elements.searchResItems.innerHTML = ``;
}

//clickin on an image to popup carousel
let search;
export const giveState = (state) => {
    search = state.data.items;
    // console.log(`ok`););
}
const getFontSize = (textLength) => {
    const baseSize = 13;
    let fontSize = 4.5;
    while(textLength >= baseSize) {
      fontSize -= .2;
      textLength -= 4;
    }
    return `${fontSize}vw`;
  }

const renderData = (search, id) => {
    for (let x = 0; x < search.length; x++) {
        if(id == search[x].data[0].nasa_id) {
            if(x == 0) {
                elements.img_left.style.display = 'none';
                elements.img_right.style.display = 'block';
            }else if(x == search.length - 1){
                elements.img_left.style.display = 'block';
                elements.img_right.style.display = 'none';
            }else{
                elements.img_right.style.display = 'block';
                elements.img_left.style.display = 'block';
            }
            const data = {
                description: search[x].data[0].description,
                title: search[x].data[0].title,
                date: search[x].data[0].date_created,
                creator: search[x].data[0].secondary_creator,
                center: search[x].data[0].center,
                keyword: search[x].data[0].keywords[0],
            }
            elements.img__title.innerHTML = data.title;
            elements.img__title.style.fontSize = getFontSize(data.title.length);
            elements.img__details.innerHTML = data.description;
            elements.img__creator.innerHTML = `<b>date_created</b>: ${data.date} </br><b>secondary_creator</b>: ${data.creator}</br><b>center</b>: ${data.center}`;
            elements.img_keyword.innerHTML = `<b>Keyword: </b><em>${data.keyword}</em>`;
        }
    };    
}
elements.searchResItems.addEventListener('click', e =>{
    const targetDiv = e.target.closest('div')
    const targetImgID = targetDiv.id;
    const markup = `
    <div class="img" id="${targetImgID}" style="background: url(https://images-assets.nasa.gov/image/${targetImgID}/${targetImgID}~orig.jpg) center/contain no-repeat"></div>
    `; 
    renderData(search, targetImgID);
    elements.img__container.innerHTML = markup;
    elements.carousel.style.display = 'grid';
});
elements.header__popupClose.addEventListener('click', e =>{
    e.preventDefault();
    elements.carousel.style.display = 'none';
    elements.header__popup.style.display = 'none';
});
elements.carouselClose.addEventListener('click', e =>{
    e.preventDefault();
    elements.carousel.style.display = 'none';

});
document.addEventListener('keydown', e =>{
    if(e.keyCode === 27 && elements.carousel.style.display != 'none') {
        elements.popupClose.click();
    }
});
elements.img_right.addEventListener('click', () =>{
    const currentID = elements.img_right.previousElementSibling.children[0].id;
    let nextID = 0;
    for (let x = 0; x < search.length; x++) {
        if (currentID == search[x].data[0].nasa_id) {
            nextID = search[x+1].data[0].nasa_id;
        }
    }
    const markup = `
    <div class="img" id="${nextID}" style="background: url(https://images-assets.nasa.gov/image/${nextID}/${nextID}~orig.jpg) center/contain no-repeat"></div>
    `;
    elements.img__container.innerHTML = markup;
    renderData(search, nextID);

});
document.addEventListener('keydown', e =>{
    if(e.keyCode === 39 && elements.img_right.style.display != 'none') {
        elements.img_right.click();
    }
});
elements.img_left.addEventListener('click', () =>{
    const currentID = elements.img_right.previousElementSibling.children[0].id;
    let prevID = 0;
    for (let x = 0; x < search.length; x++) {
        if (currentID == search[x].data[0].nasa_id){
            prevID = search[x-1].data[0].nasa_id;
        }
    }
    const markup = `
    <div class="img" id="${prevID}" style="background: url(https://images-assets.nasa.gov/image/${prevID}/${prevID}~orig.jpg) center/contain no-repeat"></div>
    `;
    elements.img__container.innerHTML = markup;
    renderData(search, prevID);
});
document.addEventListener('keydown', e =>{
    // console.log(e.keyCode);
    if(e.keyCode === 37 && elements.img_left.style.display != 'none') {
        elements.img_left.click();
    }
});


































// carousel
    // var findIndex = require("jspolyfill-array.prototype.findIndex");
    // var findIndex = require('array.prototype.findindex');
// const setSlidePos = (slide, index) =>{
//     const slidewidth  = elements.slides[0].getBoundingClientRect().width;
//     slide.style.left = slidewidth * index + `px`;
// };
// Array.prototype.forEach.call(elements.slides, setSlidePos);

// const moveSlide = (track,  current, targetSlide) =>{
//     track.style.transform = `translateX(-${targetSlide.style.left})`;
//     current.classList.remove('current');
//     targetSlide.classList.add('current');
// };

// const hideShowArrows = (targetIndex, slides, prev, next) =>{
//     if (targetIndex === 0){
//         prev.classList.add('inactive');
//         next.classList.remove('inactive');
//     }else if (targetIndex === slides.length - 1) {
//         prev.classList.remove('inactive');
//         next.classList.add('inactive');
//     }else{
//         next.classList.remove('inactive');
//         prev.classList.remove('inactive');
//     }
// };

// //todo
// // const findIndex = () =>{

// // }

// elements.prev.addEventListener('click', e =>{
//     const current = elements.track.querySelector('.current');
//     const prevSlide = current.previousElementSibling;
//     //todo cannot polyfiill
//     // const prevIndex = slides.findIndex(slide => slide === prevSlide);
//     let prevIndex = -1;
//     for (let i = 0; i < elements.slides.length; ++i) {
//         if (elements.slides[i].name == prevSlide) {
//             prevIndex = i;
//             break;
//         }
//     };
//     moveSlide(elements.track, current, prevSlide);
//     hideShowArrows(prevIndex, elements.slides, elements.prev, elements.next);
// });

// elements.next.addEventListener('click', e =>{
//     const current = elements.track.querySelector('.current');
//     const nextSlide = current.nextElementSibling;
//     //todo cannot polyfiill
//     // const nextIndex = elements.slides.findIndex(slide => slide === nextSlide);
//     let nextIndex = -1;
//     for (let i = 0; i < elements.slides.length; ++i) {
//         if (elements.slides[i].name == nextSlide) {
//             nextIndex = i;
//             break;
//         }
//     };
//     moveSlide(elements.track, current, nextSlide);
//     hideShowArrows(nextIndex, elements.slides, elements.prev, elements.next);
// });

