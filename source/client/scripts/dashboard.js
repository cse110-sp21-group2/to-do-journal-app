/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
import journalAPI from '../api/journalAPI.js';
import session from './session.js';

/**
 * TODO:
 * X GET user
 * X GET user id
 * X GET today's date
 * X GET journal entry with user's id and today's date
 *  X GET tasks array
 *  X ITERATE through tasks and grab 'content' and 'date'
 *  X POST/DISPLAY task's content with dates
 *
 *  X GET events array
 *  X ITERATE through events and grab 'content', 'startTime', and 'endTime'
 *  X POST/DISPLAY event's content with time
 *
 *  X GET notes array
 *  X ITERATE through notes and grab 'content'
 *  X POST/DISPLAY note's content
 */

if (!session.isUserLoggedIn()) {
  alert('You must be signed in to view your journal');
  window.location.href = '/signin';
}

// Today's date
const today = new Date();
console.log(`Today's date: ${today}`);
// Current User
const user = session.getUser();
// Current user's id
const id = user._id;
// TEST user
// const id = "60bebc3da19d7bd0468fed9d";
console.log(`Print current user's id: ${id}`);

// GET entry promise and set it to JSON
const getEntry = async () => {
  const payload = {
    id,
    date: today,
    type: "Daily"
  };
  const  { data: entry, success}  = await journalAPI.getJournalEntry(payload);
  // Output entry data
  if ( success ) {
    return entry;
  } else {
    return null;
  }
};
// GET entry promise
const entry = getEntry();
// TEST getting journal entry from DB
// const test_entry = await journalAPI.getJournalEntry({
//   id: "60ac3af75cc18f1184f58b9e",
//   date: "2021-05-24T23:47:03.282+00:00",
//   type: "Daily" });
// const entry = test_entry.data;


if ( await entry.then(response => {return response}) != null ) {
  // GET each task from entry and DISPLAY it
  entry.then(res => res.tasks.forEach((task) => {
    const newTask = document.createElement('task-toggle');
    newTask.content = task;
    const taskDate = new Date(task.dueDate);
    newTask.date = taskDate;
    document.querySelector('.task-container').appendChild(newTask);
  }));

  // GET each event from entry and DISPLAY it
  entry.then(res => res.events.forEach((event) => {
    const newEvent = document.createElement('event-toggle');
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    newEvent.content = event;
    newEvent.startTime = startTime;
    newEvent.endTime = endTime;
    document.querySelector('.event-container').appendChild(newEvent);
  }))

  // GET each note from entry and DISPLAY it
  entry.then(res => res.notes.forEach((note) => {
    const newNote = document.createElement('note-toggle');
    newNote.content = note;
    document.querySelector('.today-container').appendChild(newNote);
  }))
}
