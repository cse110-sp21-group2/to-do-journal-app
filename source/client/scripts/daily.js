/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */


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
const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const helpButton = document.getElementById('help');
const tutorial = document.getElementById('tutorial-overlay');
const tutorialImg = document.getElementById('tutorial');
const closeTutorial = document.getElementById('close-tutorial');
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
 if (!session.isUserLoggedIn()) {
    // eslint-disable-next-line no-alert
    alert('You must sign in to view your journal');
    window.location.href = '/signin';
  }

// GET user 
const user = session.getUser();
// GET user ID 
const id = user._id;
// Test User ID
// const id = "60bebc3da19d7bd0468fed9d";

// open either the add task or add note or add event overlay
function openOverlay(menu) {
    console.log(menu.style.visibility);
    menu.style.visibility = "visible";
}

// close menu overlay
function closeOverlay() {
  tutorial.style.visibility = "hidden";
  tutorialImg.style.visibility = "hidden";
  closeTutorial.style.visibility = "hidden";
}

// ON CLICK of help button - open the tutorial
helpButton.addEventListener('click', (event) => {
  // openOverlay(tutorial);
  tutorial.style.visibility = "visible";
  tutorialImg.style.visibility = "visible";
  closeTutorial.style.visibility = "visible";
});

// ON CLICK of close button - close the tutorial
closeTutorial.addEventListener('click', (event) => {
  closeOverlay();
});

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
let today = new Date();

// SPECIFIC Date
let currDate = today.getDate();
let currMonth = today.getMonth();
let monthName = monthNames[currMonth];
let currYear = today.getFullYear();

document.getElementById("daily-date").innerHTML = `${monthName} ${currDate}, ${currYear}`;

// FORWARD function
function nextDay() {
  // Manipulate dates
  currDate +=1;
  const tomorrow = new Date(currYear, currMonth, currDate);
  const tDate = tomorrow.getDate();
  const tMonth = tomorrow.getMonth();
  const tMonthName = monthNames[tMonth];               
  const tYear = tomorrow.getFullYear();
  document.getElementById("daily-date").innerHTML = `${tMonthName} ${tDate}, ${tYear}`;
  document.getElementById("events-content").innerHTML= "";
  document.getElementById("notes-content").innerHTML= "";
  document.getElementById("tasks-content").innerHTML= "";
  
  const dateNext = new Date(tYear, tMonth, tDate);
  today = dateNext;
  // GET entry promise
  const entry = getEntry(dateNext);
  entry.then(response => console.log(response));

  // DISPLAY entry task
  displayEntry(entry);
  displayEntryEvent(entry);
  displayEntryNote(entry);
}
const forwardBtn = document.querySelector("#tmr-btn")
forwardBtn.addEventListener("click", nextDay);

// BACKWARD function
function prevDay() {
  currDate -=1;
  const yesterday = new Date(currYear, currMonth, currDate);
  const yDate = yesterday.getDate();
  const yMonth = yesterday.getMonth();
  const yMonthName = monthNames[yMonth];
  const yYear = yesterday.getFullYear();
  document.getElementById("daily-date").innerHTML = `${yMonthName} ${yDate}, ${yYear}`;
  document.getElementById("events-content").innerHTML= "";
  document.getElementById("notes-content").innerHTML= "";
  document.getElementById("tasks-content").innerHTML= "";

  // GET entry promise
  const todayPrev = new Date(yYear, yMonth, yDate);
  today = todayPrev;
  const entry = getEntry(todayPrev);
  // Print entry JSON <-- correct entry
  entry.then(response => console.log(response));

  displayEntry(entry);
  displayEntryEvent(entry);
  displayEntryNote(entry);
}
const backBtn = document.querySelector("#yes-btn")
backBtn.addEventListener("click", prevDay);

/**
 * GET entry and CREATE entry if entry not found
 * @param {Date} todayDate some date that we're trying to get entry from
 * @returns 
 */
const getEntry = async (todayDate) => {
  const payload = {
    id,
    date: todayDate,
    type: "Daily",
  };
  const { data: entry, success } = await journalAPI.getJournalEntry(payload);
  // Output entry data
  if (success) {
    return entry;
  } else {
    const payload = {
        id,
        date: todayDate,
        type: "Daily"
    }
    journalAPI.addJournalEntry(payload);
  }
};

// GET entry promise
const entry = getEntry(today);

// GET task component
const newTask = document.createElement('create-task');
/**
 * Make create-task interface pop-up when button is clicked
 */
function createTask(createTaskComp) {
  document.querySelector('.create-task').appendChild(createTaskComp);
}
// SET click function for add-task button
const addTaskBtn = document.querySelector("#add-task");
addTaskBtn.addEventListener('click', function() { createTask(newTask); } );

/**
 * Grab the inputs and send it to MongoDB
 */
function submitTask(todayDate) {
  const payload = {
    id,
    content: newTask.getTaskContent,
    dueDate: new Date(newTask.getEndDate),
    entryDate: todayDate,
    type: 'Daily'
  };

  console.log("This is the added task:", journalAPI.addEntryTask(payload));
  window.location.reload();
}

// GET submit button and save value to mongoDB
const saveTask = newTask.submitBtn;
saveTask.addEventListener("click", function() { submitTask(today); } );

// DISPLAY tasks
function displayEntry(entry){
  console.log("This runs!");
  entry.then(res => res.tasks.forEach((task) => {
    const newTask = document.createElement('task-toggle');
    newTask.content = task;
    const taskDate = new Date(task.dueDate);
    newTask.date = taskDate;
    document.querySelector('#tasks-content').appendChild(newTask);
    const removeTaskBox = newTask.shadowRoot.querySelector('.task-icon');
    removeTaskBox.addEventListener('click', function () { deleteTask(newTask, task); });
  }));
}
displayEntry(entry);

/**
 * Delete Task
 */
function deleteTask(task, taskContent) {
  console.log('delete this task:');
  console.log(taskContent);
  
  const payload = {
    id,
    taskId: taskContent._id,
    entryDate: today,
    type: 'Daily'
  };

  journalAPI.deleteEntryTask(payload);
  task.remove();
}

// CREATE note component
const newNote = document.createElement('create-note');

/**
 * Create note interface pop-up
 */
function createNote() {
  document.querySelector(".create-note").appendChild(newNote);
}
// CLICK button to make popup
const addNoteBtn= document.querySelector("#add-note");
addNoteBtn.addEventListener("click", createNote);

/**
 * Submit notes to 
 */
function submitNote() {
  const payload = {
    id,
    content: newNote.getNoteContent,
    entryDate: today,
    type: 'Daily'
  }

  console.log(journalAPI.addEntryNote(payload));
  window.location.reload();
}


const saveNote = newNote.submitBtn;
saveNote.addEventListener("click", submitNote)

// GET each note from entry and DISPLAY it
function displayEntryNote(entry){
  entry.then(res => res.notes.forEach((note) => {
    const displayNote = document.createElement('note-toggle');
    displayNote.content = note;
    document.querySelector('#notes-content').appendChild(displayNote);
    const removeNote = displayNote.shadowRoot.querySelector('.bullet');
    removeNote.addEventListener('click', function () { deleteNote(displayNote, note); });
  }))
}
displayEntryNote(entry);
/**
 * Delete Note
 */
function deleteNote(note, noteContent) {
  console.log('delete this note:');
  console.log(noteContent);
  
  const payload = {
    id,
    noteId: noteContent._id,
    entryDate: today,
    type: 'Daily'
  };

  journalAPI.deleteEntryNote(payload);
  note.remove();
}

// CREATE create-event component
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
   let startDate = new Date();
   let endDate = new Date();

  const payload = {
    id,
    content: newEvent.getEventContent,
    startTime: new Date(startDate.toDateString() + ' ' + newEvent.getStartTime),
    endTime: new Date(endDate.toDateString() + ' ' + newEvent.getEndTime),
    entryDate: today,
    URL: newEvent.getLink,
    type: 'Daily'
  };

  console.log(payload.endTime);
  console.log(payload.startTime);
  journalAPI.addEntryEvent(payload);
  window.location.reload();
}

// GET submit button and save value to mongoDB
const saveEvent = newEvent.submitBtn;
saveEvent.addEventListener("click", submitEvent);

function displayEntryEvent(entry) {
  entry.then(res => res.events.forEach((event) => {
    const displayEvent = document.createElement('event-toggle');
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    displayEvent.content = event;
    displayEvent.startTime = startTime;
    displayEvent.endTime = endTime;
    document.querySelector('#events-content').appendChild(displayEvent);
    const removeEventBox = displayEvent.shadowRoot.querySelector('.delete-button');
    removeEventBox.addEventListener('click', function () { deleteEvent(displayEvent, event); });
  }))
}
displayEntryEvent(entry);


/**
 * Delete Event
 */
function deleteEvent(event, eventContent) {
  console.log('delete this event:');
  console.log(eventContent);
  
  const payload = {
    id,
    eventId: eventContent._id,
    entryDate: today,
    type: 'Daily'
  };

  journalAPI.deleteEntryEvent(payload);
  event.remove();
}


// For mini calendar to right
// Initial calendar creation
function createMonthCalendar() {
  // Grabs today's date
  let today = new Date();
  // Grabs today's year
  let currYear = today.getFullYear();
  // Grabs today's month
  let currMonth = today.getMonth();
  // First day worked on
  let firstDay = new Date(currYear, currMonth, 1);
  // What day is first day
  let numSpace = firstDay.getDay();
  // Array for dates
  let dates = new Array();
  // Empty spaces for days of previous month
  for (let i = 0; i < numSpace; i++) {
    dates.push("");
  }
  // Populates dates
  for(let i = 0; i < numDays[currMonth]; i++) {
    dates.push(firstDay.getDate());
    firstDay.setDate(firstDay.getDate() + 1);
  }
  // More empty spaces
  for(let i = 0; i <= 14; i+=1) {
      dates.push("");
  }
  return dates;
  }

// Grabs array of dates
const addIn = createMonthCalendar();
// Gets array of date elements 
const monthLabel = document.getElementsByClassName("date-number");
// Gets today's date
//const today = new Date();
document.getElementById("current-month").innerHTML = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
// Populates date elements 
for (let i = 0; i < addIn.length; i+=1) {
    monthLabel[i].innerHTML = addIn[i];
    if(addIn[i] === today.getDate()) {
        monthLabel[i].style.backgroundColor = "#FFF192";
    }
}

function nextMonth() {
  let calcMonth;
  // Grabs the string with the month and date
  let currLabel = document.getElementById("current-month").innerHTML;
  // Grabs the months
  for(let i = 0; i < monthNames.length; i+=1) {
    if (currLabel.includes(monthNames[i])) {
      calcMonth = i;
    }
  }
  // Grabs the year
  const currYear = currLabel.substring(currLabel.length - 4, currLabel.length);
  
  if(calcMonth + 1 > 11) {
    calcMonth = 0;
  }
  else {
    calcMonth = calcMonth + 1;
  }

  let nextYear = currYear;
  if(calcMonth === 0) {
    nextYear = parseInt(currYear, 10) + 1;
  } else {
    nextYear = currYear;
  }

  let firstDay = new Date(nextYear, calcMonth);
  let numSpace = firstDay.getDay();
  let boop = new Array();

  for (let i = 0; i < numSpace; i++) {
    boop.push("");
  }

  for(let i = 0; i < numDays[calcMonth]; i+=1) {
    boop.push(firstDay.getDate());
    firstDay.setDate(firstDay.getDate() + 1);
  }

  for(let i = boop.length; i < 42; i+=1) {
    boop.push("");
  }

  for (let i = 0; i < boop.length; i+=1) {
    monthLabel[i].innerHTML = boop[i];
    monthLabel[i].style.backgroundColor = "#FFFFFF"
  }

  document.getElementById("current-month").innerHTML = `${monthNames[calcMonth]} ${nextYear}`; 
  }


function prevMonth() {
    let calcMonth;
    // Checks for the current month
    let currLabel = document.getElementById("current-month").innerHTML;

    for(let i = 0; i < monthNames.length; i+=1) {
      if (currLabel.includes(monthNames[i])) {
        calcMonth = i;
      }
    }

    const currYear = currLabel.substring(currLabel.length - 4, currLabel.length);

    if(calcMonth - 1 < 0) {
      calcMonth = 11;
    }
    else {
      calcMonth = calcMonth - 1;
    }

    let nextYear;
    if(calcMonth === 11) {
      nextYear = currYear - 1;
    } else {
      nextYear = currYear;
    }
  
    let firstDay = new Date(nextYear, calcMonth);
    let numSpace = firstDay.getDay();
    let boop = [];

    for (let i = 0; i < numSpace; i+=1) {
      boop.push("");
    }

    for(let i = 0; i < numDays[calcMonth]; i+=1) {
      boop.push(firstDay.getDate());
      firstDay.setDate(firstDay.getDate() + 1);

    }
    for(let i = boop.length; i < 42; i+=1) {
      boop.push("");
    }

    for (let i = 0; i < boop.length; i+=1) {
      monthLabel[i].innerHTML = boop[i];
      monthLabel[i].style.backgroundColor = "#FFFFFF"
    }
    document.getElementById("current-month").innerHTML = `${monthNames[calcMonth]} ${nextYear}`; 
}
