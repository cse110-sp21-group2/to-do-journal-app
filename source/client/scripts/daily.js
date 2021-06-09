/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
import journalAPI from '../api/journalAPI.js';
import session from './session.js';

const addTask = document.getElementById('add-task');
const addEvent = document.getElementById('add-event');
const taskSubmit = document.getElementsByClassName('menu-submit')[0];
const eventSubmit = document.getElementsByClassName('menu-submit')[1];
const taskOverlay = document.getElementById('task-overlay');
const eventOverlay = document.getElementById('event-overlay');


// open either the add task or add event overlay
function openOverlay(menu) {
    console.log(menu.style.visibility);
    menu.style.visibility = "visible";
}

// close either menu overlay
function closeOverlay() {
    taskOverlay.style.visibility = "hidden";
    eventOverlay.style.visibility = "hidden";
}

// ON CLICK of add task button - open the add task menu
addTask.addEventListener('click', (event) => {
    openOverlay(taskOverlay);
});

// ON CLICK of add event button - open the add event menu
addEvent.addEventListener('click', (event) => {
    openOverlay(eventOverlay);
});

// ON CLICK of task submit button - close menu
taskSubmit.addEventListener('click', (event) => {
    closeOverlay();
});

// ON CLICK of event submit button - close menu
eventSubmit.addEventListener('click', (event) => {
    closeOverlay();
});