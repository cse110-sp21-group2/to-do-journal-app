/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */
/* eslint-disable import/extensions */
import session from './session.js';
import journalAPI from '../api/journalAPI.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const collectionName = urlParams.get('name');

const addNote = document.getElementById('add-note');
const addEvent = document.getElementById('add-event');
const noteOverlay = document.getElementById('note-overlay');
const eventOverlay = document.getElementById('event-overlay');

document.getElementById('collection-name').innerHTML = collectionName;

const user = session.getUser();
const id = user._id;

if (!session.isUserLoggedIn()) {
  alert('You must be signed in to view your journal');
  window.location.href = '/signin';
}

function openOverlay(menu) {
  console.log(menu.style.visibility);
  menu.style.visibility = "visible";
}

// ON CLICK of add note button - open the add note menu
addNote.addEventListener('click', (event) => {
  openOverlay(noteOverlay);
});

// ON CLICK of add event button - open the add event menu
addEvent.addEventListener('click', (event) => {
  openOverlay(eventOverlay);
});

// Today's date
const today = new Date();

// Get collection
const getCollection = async () => {
  // Prepare payload
  const payload = {
    id,
    collectionName,
  };

  // Attempt to get journal collection
  const { success, data: collection = null } = await journalAPI.getJournalCollection(
    payload
  );

  // Return collection if successful
  if (success) {
    return collection;
  }

  // const { data: newCollection } = await journalAPI.addJournalCollection(payload);

  // return newCollection;
};

// Initialize page
(async function main() {
  // Get this collection
  const collection = await getCollection();

  // Get notes and events
  const { notes, events } = collection;

  // CREATE note component
  const newNote = document.createElement('create-note');

  /**
   * Create note interface pop-up
   */
  function createNote() {
    document.querySelector(".create-note").appendChild(newNote);
  }
  // CLICK button to make popup
  const addNoteBtn = document.querySelector("#add-note");
  addNoteBtn.addEventListener("click", createNote);

  /**
 * Submit notes to 
 */
  function submitNote() {
    const payload = {
      id,
      content: newNote.getNoteContent,
      collectionId: collection._id
    }

    console.log(journalAPI.addCollectionNote(payload));
    window.location.reload();
  }

  const saveNote = newNote.submitBtn;
  saveNote.addEventListener("click", submitNote)

  // Add notes to page
  for (let k = 0; k < notes.length; k += 1) {
    const newNote = document.createElement('note-toggle');

    newNote.content = notes[k];

    document.querySelector('#notes-container').appendChild(newNote);
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
  const addEventBtn = document.querySelector("#add-event");
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
      URL: newEvent.getLink,
      collectionId: collection._id,
    };

    journalAPI.addCollectionEvent(payload);
    window.location.reload();
  }

  // GET submit button and save value to mongoDB
  const saveEvent = newEvent.submitBtn;
  saveEvent.addEventListener("click", submitEvent);

  // Add events to page
  for (let i = 0; i < events.length; i += 1) {
    const newEvent = document.createElement('event-toggle');

    const startTime = new Date(events[i].startTime);
    const endTime = new Date(events[i].endTime);

    newEvent.content = events[i];
    newEvent.startTime = startTime;
    newEvent.endTime = endTime;

    document.querySelector('.event-container').appendChild(newEvent);
  }
})();
