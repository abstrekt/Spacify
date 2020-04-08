import { elements } from "./base";

export const typewriter = () => {
  const words = [
    "WELCOME TO SPACIFY ('.')",
    "SPACIFY IS A WebApp POWERED BY { NASA APIs } ",
    "YOU CAN USE IT TO SEARCH FOR SPACE OBJECTS...",
    "CURRENTLY WE ONLY SUPPORT IMAGES :/",
    "JUST BEGIN BY HOVERING OVER ↓ BELOW! or CLICK THE IMAGE BEHIND :)"
  ];
  let count = 0;
  let index = 0;
  let currentWord = "";
  let letter = "";
  let deleting = false;
  elements.typewriter.style.display = "block";
  (async function type() {
    if (count === words.length) {
      await sleep(1500);
      elements.typewriter.style.display = "none";
      return;
    }
    currentWord = words[count];

    if (deleting == false) {
      letter = currentWord.slice(0, ++index);
      document.querySelector(".typing").innerHTML = letter;
    }
    if (letter.length === currentWord.length) {
      await sleep(1000);
      deleting = true;
    }
    if (deleting == true) {
      letter = currentWord.slice(0, --index);
      document.querySelector(".typing").innerHTML = letter;
    }

    if (letter.length == 0) {
      count++;
      index = 0;
      deleting = false;
    }
    if (deleting == true) {
      setTimeout(type, 10);
    } else {
      setTimeout(type, 70);
    }
  })();
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
