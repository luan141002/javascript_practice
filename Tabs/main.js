const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tab_item = $$(".tab-item");
const tab_pane = $$(".tab-pane");

const tab_active = $(".tab-item .active");
var line = $(".tabs .line");
line.style.left = this.offsetLeft + "px";
line.style.width = this.offsetWidth + "px";

tab_item.forEach((tab, index) => {
  tab.onclick = () => {
    $(".tab-item.active").classList.remove("active");
    $(".tab-pane.active").classList.remove("active");
    line.style.left = tab.offsetLeft + "px";
    line.style.width = tab.offsetWidth + "px";
    tab.classList.add("active");
    tab_pane[index].classList.add("active");
  };
});
