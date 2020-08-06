import { elements } from '../common';

const $ = (str) => {
  const element = document.querySelector(str);
  return {
    click(handler) {
      element.addEventListener('click', handler);
    },
    getNode() {
      return element;
    },
  };
};
export default $;