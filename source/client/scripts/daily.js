import session from './session.js';
import journalAPI from '../api/journalAPI.js';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const addTask = document.getElementById('add-task');
const addNote = document.getElementById('add-note');
const addEvent = document.getElementById('add-event');
const taskOverlay = document.getElementById('task-overlay');
const noteOverlay = document.getElementById('note-overlay');
const eventOverlay = document.getElementById('event-overlay');

/**
 * TODO:
 *      - Check that user is logged in
 *      - GET journal
 *      - GET entries 
 *      - Go through each entry to see if there exist an entry for current date
 *          - Make new entry otherwise based on date
 *      - In that entry, create new task
 */


/**
 * If user is not logged in -> redirect to signin page
 */
//  if (!session.isUserLoggedIn()) {
//     // eslint-disable-next-line no-alert
//     alert('You must sign in to view your journal');
//     window.location.href = '/signin';
//   }

// GET user 
const user = session.getUser();
// GET user ID 
// const id = user._id;
// Test User ID
const id = "60bebc3da19d7bd0468fed9d";

// open either the add task or add note or add event overlay
function openOverlay(menu) {
    console.log(menu.style.visibility);
    menu.style.visibility = "visible";
}

// ON CLICK of add task button - open the add task menu
addTask.addEventListener('click', (event) => {
    openOverlay(taskOverlay);
});

// ON CLICK of add note button - open the add note menu
addNote.addEventListener('click', (event) => {
  openOverlay(noteOverlay);
});

// ON CLICK of add event button - open the add event menu
addEvent.addEventListener('click', (event) => {
    openOverlay(eventOverlay);
});

/**
 * Getting journal for that specific userid from journalAPI
 *  @returns {object} Journal.
 */
 const getJournal = async () => {
    const payload = {
      id
    };
    const { data: journal } = await journalAPI.getJournal(payload);
    return journal;
  } 

// GET journal promise
const journal = getJournal();
// GET Date
const today = new Date();

// SPECIFIC Date
let currDate = today.getDate();
let currMonth = today.getMonth();
let monthName = monthNames[currMonth];
let currYear = today.getFullYear();
document.getElementById("daily-date").innerHTML = `${monthName} ${currDate}, ${currYear}`;

// This only works based on the currMonth and currDate, we need to update it 
function nextDay() {
  
  const tomorrow = new Date(currYear, currMonth, currDate + 1);
  const tDate = tomorrow.getDate();
  const tMonth = tomorrow.getMonth();
  const tMonthName = monthNames[tMonth];
  const tYear = tomorrow.getFullYear();
  document.getElementById("daily-date").innerHTML = `${tMonthName} ${tDate}, ${tYear}`;
}
const forwardBtn = document.querySelector("#tmr-btn")
forwardBtn.addEventListener("click", nextDay);

function prevDay() {
  const yesterday = new Date(currYear, currMonth, currDate - 1);
  const yDate = yesterday.getDate();
  const yMonth = yesterday.getMonth();
  const yMonthName = monthNames[yMonth];
  const yYear = yesterday.getFullYear();
  document.getElementById("daily-date").innerHTML = `${yMonthName} ${yDate}, ${yYear}`;
}
const backBtn = document.querySelector("#yes-btn")
backBtn.addEventListener("click", prevDay);


// GET entry and CREATE entry if entry not found
const getEntry = async () => {
  const payload = {
    id,
    date: today,
    type: "Daily",
  };
  const { data: entry, success } = await journalAPI.getJournalEntry(payload);
  // Output entry data
  if (success) {
    return entry;
  } else {
    const payload = {
        id,
        date: today,
        type: "Daily"
    }

    journalAPI.addJournalEntry(payload);
  }
};

// GET entry promise
const entry = getEntry();
// Print entry JSON
entry.then(response => console.log(response));

const newTask = document.createElement('create-task');

/**
 * Make create-task interface pop-up when button is clicked
 */
function createTask() {
  document.querySelector('.create-task').appendChild(newTask);
}
// SET click function for add-task button
const addTaskBtn = document.querySelector("#add-task");
addTaskBtn.addEventListener('click', createTask);

/**
 * Grab the inputs and send it to MongoDB
 */
function submitTask() {
  const payload = {
    id,
    content: newTask.getTaskContent,
    dueDate: new Date(newTask.getEndDate),
    entryDate: today,
    type: 'Daily'
  };

  console.log(journalAPI.addEntryTask(payload));
}

// GET submit button and save value to mongoDB
const saveTask = newTask.submitBtn;
saveTask.addEventListener("click", submitTask);

// DISPLAY tasks
entry.then(res => res.tasks.forEach((task) => {
  const newTask = document.createElement('task-toggle');
  newTask.content = task;
  const taskDate = new Date(task.dueDate);
  newTask.date = taskDate;
  document.querySelector('#tasks-content').appendChild(newTask);
}));

// CREATE event component
const newEvent = document.createElement('create-event');

/**
 * Create event interface pop-up
 */
function createEvent() {
  document.querySelector(".create-event").appendChild(newEvent);
}
// CLICK button to make popup
const addEventBtn= document.querySelector("#add-event");
addEventBtn.addEventListener("click", createEvent);

/**
 * Grab the inputs and send it to MongoDB
 */
 function submitEvent() {
  const payload = {
    id,
    content: newEvent.getEventContent,
    startTime: newEvent.getStartTime,
    endTime: newEvent.getEndTime,
    entryDate: today,
    URL: null,
    type: 'Daily'
  };

  console.log(journalAPI.addEntryEvent(payload));
}

// GET submit button and save value to mongoDB
const saveEvent = newEvent.submitBtn;
saveEvent.addEventListener("click", submitEvent);

// entry.then(res => res.events.forEach((event) => {
//   const newEvent = document.createElement('event-toggle');
//   const startTime = new Date(event.startTime);
//   const endTime = new Date(event.endTime);
//   newEvent.content = event;
//   newEvent.startTime = startTime;
//   newEvent.endTime = endTime;
//   document.querySelector('.event-container').appendChild(newEvent);
// }))

/**
 * TODO:
 * - FORWARD arrow
 * - BACKWARD arrow
 * - Event add and display
 *    - create-event.js component
 * - Notes add and display
 *    - create-note.js component
 */

