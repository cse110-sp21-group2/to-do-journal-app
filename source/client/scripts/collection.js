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

document.getElementById('collection-name').innerHTML = collectionName;

const user = session.getUser();
const id = user._id;

if (!session.isUserLoggedIn()) {
  alert('You must be signed in to view your journal');
  window.location.href = '/signin';
}

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

  // Add notes to page
  for (let k = 0; k < notes.length; k += 1) {
    const newNote = document.createElement('note-toggle');

    newNote.content = notes[k];

    document.querySelector('.today-container').appendChild(newNote);
  }

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
