"use strict";
// inspired by: https://stackoverflow.com/a/8398189/8075455
var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    w = 0,
    h = 0,
    dot_flag = false;

var x = "black",
    y = 2;

window.addEventListener('load', sketchpad_init);

function sketchpad_init() {
    canvas = document.getElementById('sketchpad-drawzone');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        sketchpad_findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        sketchpad_findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        sketchpad_findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        sketchpad_findxy('out', e)
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        sketchpad_findxy('move', e, true)
    }, false);
    canvas.addEventListener("touchstart", function (e) {
        sketchpad_findxy('down', e, true)
    }, false);
    canvas.addEventListener("touchend", function (e) {
        sketchpad_findxy('up', e, true)
    }, false);
}

function sketchpad_pencil(color = 'black') {
    x = color;
    if (x == "white") {
        y = 14;
    }
    else {
        y = 2;
    }
}

function sketchpad_draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function sketchpad_clear() {
    const m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
    }
}

function sketchpad_save(url_to_post) {
    const dataURL = canvas.toDataURL().split(',');
    const jsonToSend = {
        image: dataURL[1],
        type: 'base64',
        extention: 'png',
    };
    fetch(
        url_to_post,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonToSend),
        })
        .then(response => response.json())
        .then((result) => {
            alert(result.status);
        })
        .catch((error) => {
            console.error("Error", error);
        });
}

function sketchpad_findxy(res, e, is_touch = false) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        if (is_touch) {
            currX = e.touches["0"].clientX - canvas.getBoundingClientRect().left;
            currY = e.touches["0"].clientY - canvas.getBoundingClientRect().top;
        }
        else {
            currX = e.clientX - canvas.getBoundingClientRect().left;
            currY = e.clientY - canvas.getBoundingClientRect().top;
        }

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    else if (res == 'up' || res == "out") {
        flag = false;
    }
    else if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            if (is_touch) {
                currX = e.touches["0"].clientX - canvas.getBoundingClientRect().left;
                currY = e.touches["0"].clientY - canvas.getBoundingClientRect().top;
            }
            else {
                currX = e.clientX - canvas.getBoundingClientRect().left;
                currY = e.clientY - canvas.getBoundingClientRect().top;
            }
            sketchpad_draw();
        }
    }
}
