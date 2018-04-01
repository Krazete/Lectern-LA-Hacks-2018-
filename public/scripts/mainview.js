var tabItems;
var tabInfos;
var subtexts;

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

function videoListener() {
    for (var i = 0; i < subtexts.length; i++) {
        subtexts[i].className = "subtext";
        if (subtexts[i].dataset.timestamp < video.getTime()) {
            subtexts[i].classList.add("passed");
        }
    }
    requestAnimationFrame(videoListener);
}

function init() {
    var video = document.createElement("video");
    video.src = "/temporary.mp4";
    var videoContainer = document.getElementById("video-container");
    videoContainer.appendChild(video);

    subtexts = Array.from(document.getElementsByClassName("subtext"));
    subtexts.forEach(function (subtext) {
        subtext.classList.add("subtext");
        subtext.dataset.timestamp = 0;
        subtext.addEventListener("click", function () {
            video.setTime(subtext.dataset.timestamp);
        });
    });

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

    var notesQuill = new Quill("#notes-editor", {
        theme: "snow"
    });
    var notesSubmit = document.getElementById("notes-submit");
    notesSubmit.addEventListener("click", function () {
        var quillRoot = Array.from(notesQuill.root.children);
        var div = document.createElement("div");
        quillRoot.forEach(function (p) {
            div.appendChild(p);
        });
        document.body.appendChild(div);
    });

    var commentsQuill = new Quill("#comments-editor", {
        theme: "snow"
    });
    var commentsSubmit = document.getElementById("comments-submit");
    commentsSubmit.addEventListener("click", function () {
        var quillRoot = Array.from(commentsQuill.root.children);
        var div = document.createElement("div");
        quillRoot.forEach(function (p) {
            div.appendChild(p);
        });
        document.body.appendChild(div);
    });

    var logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        document.cookie = "lectern=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        location.reload();
    });
}

window.addEventListener("DOMContentLoaded", init);



/* Begin Easter Egg */
var konami = (function () {
    let list = [];
    let konamiCode = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
        "KeyB", "KeyA", "Enter"
    ];
    return function (key) {
        list.push(key.code);
        for (let i = 0; i < list.length; i++) {
            if (list[i] != konamiCode[i]) {
                list.pop();
                break;
            }
        }
        if (list.length == konamiCode.length) {
            window.removeEventListener("keydown", konami);
            document.body.appendChild(document.createElement("script")).src="https://rawgit.com/Krazete/bookmarklets/master/tri.js";
        }
    };
})();
window.addEventListener("keydown", konami);
/* End Easter Egg */
