import MainService from "./mainService.js";

window.addEventListener("DOMContentLoaded", () => {
  const targetEl = document.querySelector("#app");

  const service = new MainService({ targetEl });
  const datalist = [1, 2, 3, 4, [5, 6, [7]]];
  service.init(datalist.flat(2));

  targetEl.innerHTML += `datalist is ${service.dataList}`;
});
