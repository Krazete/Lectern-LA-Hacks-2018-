var tabItems;
var tabInfos;
var video;
var player;

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

function videoListener() {
    console.log(video.currentTime);
    var passed = true;
    var subtexts = document.getElementById("subs").children;
    for (var i = 0; i < subtexts.length; i++) {
        subtexts[i].className = "subtext";
        if (subtexts[i].dataset.timestamp < player.getCurrentTime()) {
            subtexts[i].classList.add("passed");
        }
    }
    if (player.getPlayerState() == 1) {
        requestAnimationFrame(videoListener);
    }
}

function initSubs(response) {
    var subs = document.getElementById("subs");
    subs.innerHTML = "";

    var parser = new DOMParser;

    var content = document.createElement("div");
    content.innerHTML = this.responseText;
    var subtexts = Array.from(content.getElementsByTagName("text"));
    subtexts.forEach(function (s) {
        var subtext = document.createElement("span");
        subtext.className = "subtext";
        var dom = parser.parseFromString("<!doctype html><body>" + s.innerHTML, "text/html");
        subtext.innerHTML = dom.body.textContent + " ";
        subtext.dataset.timestamp = s.getAttribute("start");
        subtext.dataset.timedelta = s.getAttribute("dur");
        subtext.addEventListener("click", function () {
            player.seekTo(subtext.dataset.timestamp);
        });
        subs.appendChild(subtext);
    });
}

function loadVideo() {
    var vid = document.getElementById("main-content").dataset.vid;

    var videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "";
    video = document.createElement("iframe");
    video.id = "youtube-video";
    video.width = "100%";
    video.height = "100%";
    video.src = "https://www.youtube.com/embed/" + vid + "?modestbranding=1&autohide=1&showinfo=0&controls=0&cc_load_policy=3&enablejsapi=1";
    video.setAttribute("frameborder", "0");
    video.setAttribute("allowfullscreen", "");
    videoContainer.appendChild(video);

    player = new YT.Player("youtube-video", {
        "events": {
            "onStateChange": function (e) {
                if (e.data == 1) {
                    videoListener();
                }
            }
        }
    });

    var xml = new XMLHttpRequest();
    xml.open("POST", "https://video.google.com/timedtext?lang=en&v=" + vid, true);
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xml.onload = initSubs;
    xml.send();
}

function onYouTubeIframeAPIReady() {
    loadVideo();
}

function init() {
    var videoList = Array.from(document.getElementById("videos").getElementsByTagName("input")).forEach(function (e) {
        e.addEventListener("click", function () {
            document.getElementById("main-content").dataset.vid = this.dataset.vid;
            loadVideo();
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
        modules: {
            toolbar: false
        },
        theme: "snow"
    });
    commentsQuill.on("text-change", function () {
        // console.log(commentsQuill.getText());
        // commentsQuill.setText(commentsQuill.getText());
        // var len = commentsQuill.getText().length;
        commentsQuill.removeFormat(0, Number.MAX_SAFE_INTEGER);
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
