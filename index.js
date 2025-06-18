"use strict";
let time = [0, 0, 0, 0];
let keyListening = false;
let timerInterval;
let secondover = false;
let timerover = false;
let paused = false;
let stopped = false;
document.addEventListener('DOMContentLoaded', () => {
    const clock = document.querySelector('#clock h1');
    const start = document.getElementById('start-button');
    const pause = document.getElementById('pause-button');
    const stop = document.getElementById('stop-button');
    const select = document.getElementById('select-button');
    const right = document.getElementById('right-arrow');
    const left = document.getElementById('left-arrow');
    if (clock) {
        clock.addEventListener('click', () => {
            time = [0, 0, 0, 0];
            clock.textContent = formatTimeFromTyped(time, false);
            if (!keyListening) {
                document.addEventListener('keydown', whenKeyDown);
                keyListening = true;
            }
        });
    }
    if (start && time.length == 4 && clock && stop) {
        stop.addEventListener('click', () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                time = [0, 0, 0, 0];
                timerInterval = undefined;
                timerover = true;
                clock.textContent = formatTimeFromTyped(time, secondover);
                stopped = true;
            }
        });
    }
    if (start && time.length == 4 && clock && pause) {
        pause.addEventListener('click', () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = undefined;
                timerover = false;
                paused = true;
            }
        });
    }
    if (start && time.length == 4 && clock) {
        start.addEventListener('click', () => {
            if ((!timerInterval)) {
                timerInterval = setInterval(() => {
                    if (timerover) {
                        time = [0, 0, 0, 0];
                    }
                    secondover = true;
                    clock.textContent = formatTimeFromTyped(time, secondover);
                    secondover = false;
                }, 1000);
            }
        });
    }
    function whenKeyDown(event) {
        let key = event.key;
        if (key == 'Backspace' && clock) {
            time.pop();
            time.unshift(0);
            clock.textContent = formatTimeFromTyped(time, secondover);
        }
        if (key == 'Enter' && clock) {
            clock.textContent = formatTimeFromTyped(time, secondover);
            //remove Eventlistener for keypresses
            document.removeEventListener('keydown', whenKeyDown);
            timerover = false;
            keyListening = false;
        }
        if (key >= '0' && key <= '9' && time.length <= 4 && clock) {
            if (time.length >= 4) {
                time.shift();
            }
            time.push(parseInt(key));
            clock.textContent = formatTimeFromTyped(time, secondover);
        }
    }
});
function formatTimeFromTyped(time, secondover) {
    if (secondover == true) {
        if (time[3] > 0) {
            time[3] -= 1;
        }
        else if (time[2] > 0) {
            time[2] -= 1;
            time[3] = 9;
        }
        else if (time[1] > 0) {
            time[1] -= 1;
            time[2] = 5;
            time[3] = 9;
        }
        else if (time[0] > 0) {
            time[0] -= 1;
            time[1] = 9;
            time[2] = 5;
            time[3] = 9;
        }
    }
    if (time[2] >= 6 && secondover == false) {
        time[1] += 1;
        time[2] -= 6;
    }
    const minutes = time[0] * 10 + time[1];
    const seconds = time[2] * 10 + time[3];
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
