"use strict";
let time = [];
let counter = 0;
let keyListening = false;
let timerInterval;
let timerover = true;
let is_confirmed = false;
let started = false;
let paused = false;
let mascot_index = 0;
const mascots = [
    { id: 0, pic: 'sprites/frog_mascot.png', animations: [] },
    { id: 1, pic: 'sprites/red_panda_mascot.png', animations: [] },
    { id: 2, pic: 'sprites/mascot_unlocked.png', animations: [] },
];
document.addEventListener('DOMContentLoaded', () => {
    const clock = document.querySelector('#clock h1');
    const start = document.getElementById('start-button');
    const pause = document.getElementById('pause-button');
    const stop = document.getElementById('stop-button');
    const left_mascot = document.querySelector('#left-mascot img');
    const right_mascot = document.querySelector('#right-mascot img');
    const selected_mascot = document.querySelector('#selected-mascot img');
    const left_arrow = document.getElementById('left-arrow-button');
    const right_arrow = document.getElementById('right-arrow-button');
    const select = document.getElementById('select-button');
    if (clock) {
        clock.addEventListener('click', () => {
            clock.textContent = formatEingabe(time);
            if (!keyListening) {
                document.addEventListener('keydown', eingabe);
                counter = time.length;
                keyListening = true;
            }
        });
    }
    if (left_arrow) {
        left_arrow.addEventListener('click', () => {
            mascot_index = (mascot_index - 1 + mascots.length) % mascots.length;
            switchMascot(left_mascot, right_mascot, selected_mascot);
        });
    }
    if (right_arrow) {
        right_arrow.addEventListener('click', () => {
            mascot_index = (mascot_index + 1 + mascots.length) % mascots.length;
            ;
            switchMascot(left_mascot, right_mascot, selected_mascot);
        });
    }
    if (select) {
        select.addEventListener('click', () => {
            selectMascot();
        });
    }
    if (stop) {
        stop.addEventListener('click', () => {
            if (is_confirmed) {
                stopTimer(clock);
            }
        });
    }
    if (pause) {
        pause.addEventListener('click', () => {
            if (is_confirmed) {
                pauseTimer(clock);
            }
        });
    }
    if (start) {
        start.addEventListener('click', () => {
            if (is_confirmed) {
                startTimer(time, clock);
            }
        });
    }
    function eingabe(event) {
        if (started)
            return;
        const key = event.key;
        if (key === 'Backspace' && clock) {
            if (counter > 0) {
                counter -= 1;
                time.splice(counter, 1);
            }
            clock.textContent = formatEingabe(time);
            return;
        }
        if (key === 'Enter' && clock) {
            is_confirmed = true;
            while (time.length < 4) {
                time.push('0');
            }
            clock.textContent = formatEingabe(time);
            clock.textContent = formatTime(time);
            document.removeEventListener('keydown', eingabe);
            keyListening = false;
            timerover = false;
            return;
        }
        if (key >= '0' && key <= '9' && clock && counter < 4) {
            time[counter] = key;
            counter += 1;
            clock.textContent = formatEingabe(time);
        }
    }
});
function switchMascot(left_mascot, right_mascot, selected_mascot) {
    if (selected_mascot) {
        selected_mascot.src = mascots[mascot_index].pic;
    }
}
function selectMascot() {
}
function formatEingabe(time_string) {
    const formatted = [...time_string];
    while (formatted.length < 4) {
        formatted.push('-');
    }
    return `${formatted[0]}${formatted[1]}:${formatted[2]}${formatted[3]}`;
}
function formatTime(time_string) {
    let digits = time_string.map(d => parseInt(d) || 0);
    let totalSeconds = (digits[0] * 10 + digits[1]) * 60 + (digits[2] * 10 + digits[3]);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let index0 = Math.floor(minutes / 10);
    let index1 = minutes % 10;
    let index2 = Math.floor(seconds / 10);
    let index3 = seconds % 10;
    time = [index0.toString(), index1.toString(), index2.toString(), index3.toString()];
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
function startTimer(time, clock) {
    if (!is_confirmed || timerover || started)
        return;
    paused = false;
    timerInterval = setInterval(() => {
        started = true;
        let digits = time.map(d => parseInt(d) || 0);
        let totalSeconds = (digits[0] * 10 + digits[1]) * 60 + (digits[2] * 10 + digits[3]);
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = undefined;
            timerover = true;
            started = false;
            if (clock)
                clock.textContent = '00:00';
            return;
        }
        totalSeconds -= 1;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const m1 = Math.floor(minutes / 10);
        const m2 = minutes % 10;
        const s1 = Math.floor(seconds / 10);
        const s2 = seconds % 10;
        time[0] = m1.toString();
        time[1] = m2.toString();
        time[2] = s1.toString();
        time[3] = s2.toString();
        if (clock) {
            clock.textContent = `${m1}${m2}:${s1}${s2}`;
        }
    }, 1000);
}
function pauseTimer(clock) {
    if (started && timerInterval !== undefined) {
        clearInterval(timerInterval);
        started = false;
        paused = true;
        timerInterval = undefined;
    }
}
function stopTimer(clock) {
    if (timerInterval !== undefined) {
        clearInterval(timerInterval);
        timerInterval = undefined;
    }
    started = false;
    paused = false;
    timerover = true;
    counter = 0;
    time = [];
    if (clock) {
        clock.textContent = '00:00';
    }
}
