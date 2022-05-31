/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
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

  if (!session.isUserLoggedIn()) {
    // eslint-disable-next-line no-alert
    alert('You must be signed in to view your journal');
    window.location.href = '/signin';
  }

// GET user
const user = session.getUser();
// GET user ID
const id = user._id;
// Test User ID
// const id = "60bebc3da19d7bd0468fed9d";



/**
 * get journal .
 * get journal entries: get the start date and end date for that specific week -> call journalAPI.getJournalEntries
 * for each daily entry -> run entry.then for each to display only the events in the correct div container
or each event t */


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

const allDays = document.querySelectorAll('.column-content');

/**
 * Getting journal entry for one day
 *  @returns {object} Journal.
 */
 const getEntry = async (oneDay) => {
  const payload = {
    id,
    date: oneDay.getAttribute('date-object'),
    type:'Daily'
  };
  const { data: entry, success } = await journalAPI.getJournalEntry(payload);
  if ( success ) {
    return entry;
  }
    return null;

}

// Go through each day in the week to find if it has dailyentries
for(let i = 0; i < allDays.length; i+=1) {
  const entry = getEntry(allDays[i]);

  if ( entry != null ) {
    // GET each event from entry and DISPLAY it
    entry.then(res => res.events.forEach((event) => {
        const newEvent = document.createElement('event-toggle');
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);
        newEvent.content = event;
        newEvent.startTime = startTime;
        newEvent.endTime = endTime;

        allDays[i].appendChild(newEvent);
    }))
  }
}


// FORWARD function
function changeWeek() {
  const allDays = document.querySelectorAll('.column-content');
  // Go through each day in the week to find if it has dailyentries
  for(let i = 0; i < allDays.length; i+=1) {
    const entry = getEntry(allDays[i]);
    allDays[i].innerHTML = "";

    if ( entry != null ) {
      // GET each event from entry and DISPLAY it
      entry.then(res => res.events.forEach((event) => {
          const newEvent = document.createElement('event-toggle');
          const startTime = new Date(event.startTime);
          const endTime = new Date(event.endTime);
          newEvent.content = event;
          newEvent.startTime = startTime;
          newEvent.endTime = endTime;

          allDays[i].appendChild(newEvent);
      }))
    }
  }
}

const forwardBtn = document.querySelector("#fwd-btn")
forwardBtn.addEventListener("click", changeWeek);


const backBtn = document.querySelector("#bk-button")
backBtn.addEventListener("click", changeWeek);
