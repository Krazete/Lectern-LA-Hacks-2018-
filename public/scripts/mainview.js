var tabItems;
var tabInfos;

function resetTabItems() {
    tabItems.forEach(function (tabItem) {
        tabItem.classList.remove("selected");
    });
    tabInfos.forEach(function (tabInfo) {
        tabInfo.classList.remove("selected");
    })
}

function selectTabItem(tabItem) {
    tabItem.classList.add("selected");
    document.getElementById(tabItem.id + "-info").classList.add("selected");
}

function scrollSubs(d) {
    var subs = document.getElementById("subs");
    subs.scrollBy(0, d);
    requestAnimationFrame(function () {
        scrollSubs(d);
    });
}

function init() {
    tabItems = Array.from(document.getElementsByClassName("tab-item"));
    tabInfos = Array.from(document.getElementsByClassName("tab-info"));
    tabItems.forEach(function (tabItem) {
        tabItem.addEventListener("click", function () {
            resetTabItems();
            selectTabItem(tabItem);
        });
    });
    selectTabItem(tabItems[0]);
    scrollSubs(1);

    var quill = new Quill("#editor", {
        theme: "snow"
    });
}

window.addEventListener("DOMContentLoaded", init);
