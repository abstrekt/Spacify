import axios from "axios";
import { elements } from "../view/base";

export class SearchAPOD {
  async getAPOD() {
    const key = "XMW1uWHuORTAO1OrGMH3w2nb5r2urii7qvbakeMr";
    try {
      const res = await axios(
        `https://api.nasa.gov/planetary/apod?api_key=${key}`
      );
      this.result = res.data;
    } catch (err) {
      alert("API error: Please try after sometimes :(");
    }
  }
}

export class SearchNasa {
  constructor(query) {
    this.query = query;
    this.pageNo = 1;
  }
  async getData(page) {
    try {
      const data = await axios(
        `https://images-api.nasa.gov/search?page=${page}&q=${this.query}&media_type=image`
      );
      this.data = data.data.collection;
    } catch (err) {
      alert("API error: Please try after sometimes :(");
    }
  }
}

elements.carousel_img_down.addEventListener("click", () => {
  const currentID = elements.img_right.previousElementSibling.children[0].id;
  elements.carousel_img_down.setAttribute(
    "href",
    `https://images-assets.nasa.gov/image/${currentID}/${currentID}~orig.jpg`
  );
});

elements.btnScrollToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
});

window.onscroll = () => {
  if (
    document.body.scrollTop > 2200 ||
    document.documentElement.scrollTop > 2200
  ) {
    elements.btnScrollToTop.style.display = "block";
  } else {
    elements.btnScrollToTop.style.display = "none";
  }
};
