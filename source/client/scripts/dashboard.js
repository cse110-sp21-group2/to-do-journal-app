import journalAPI from '../api/journalAPI.js';
import session from './session.js';

/* eslint-disable no-console */
/* eslint-disable no-undef */

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

// Today's date
const today = new Date();    
// Current User
const user = session.getUser();
// Current user's id
const id = user._id;
console.log("Print current user's id: " + id);

// GET entry promise and set it to JSON
const journalEntry = await journalAPI.getJournalEntry(id, today, 'Daily');
// TEST getting journal entry from DB
// const journalEntry = await journalAPI.getJournalEntry("60ac3af75cc18f1184f58b9e", "2021-05-24T23:50:03.282+00:00", 'Daily');

const { data: entry } = await journalEntry.json();


// GET each task from entry and DISPLAY it
entry.tasks.forEach((task) => {
    let newTask = document.createElement('task-toggle');
    newTask.content = task;
    let taskDate = new Date(task.dueDate);
    newTask.date = taskDate;
    document.querySelector(".task-container").appendChild(newTask);
});

// GET each event from entry and DISPLAY it
entry.events.forEach((event) => {
    let newEvent= document.createElement('event-toggle'); 
    let startTime = new Date(event.startTime);
    let endTime = new Date(event.endTime);
    newEvent.content = event;
    newEvent.startTime = startTime;
    newEvent.endTime = endTime;
    document.querySelector(".event-container").appendChild(newEvent);
});

// GET each note from entry and DISPLAY it
entry.notes.forEach((note) => {
    let newNote = document.createElement('note-toggle');
    newNote.content = note;
    document.querySelector('.today-container').appendChild(newNote);
});
