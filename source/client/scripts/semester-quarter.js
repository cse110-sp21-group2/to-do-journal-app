import session from './session.js';
import journalAPI from '../api/journalAPI.js';

/**
 * TODO:
 *      - Know when it's quarterly or semesterly(User Setting)
 *      - GET journal
 *      - GET entries (semester or quqarter)
 *      - Go through each entry to see if there exist an entry for current date
 *          - Make new entry otherwise based on date
 *      - In that entry, create new task
 */

if (!session.isUserLoggedIn()) {
  // eslint-disable-next-line no-alert
  alert('You must sign in to view your journal');
  window.location.href = '/signin';
}

// Today's date
const today = new Date();
console.log(`Today's date: ${today}`);

// Current User
const user = session.getUser();
// Current user's id
// const id = user._id;
// TEST USER ID
const id = "60bebc3da19d7bd0468fed9d";
console.log(`Print current user's id: ${id}`);

// Return "Quarter" or "Semester" DEFAULT: "Quarter"
let termType = user.term;
if(user.term === ""){
  termType= "Quarter";
}
console.log(`Print term type: ${termType}`);

// SET end Date for end of quarter
let endDate = new Date();
endDate.setDate(endDate.getDate() + 70);
console.log(`Quarter ends on this day: ${endDate}`);

// GET journal of user
const getJournal = async () => {
  const payload = {
    id
  };

  const { data: journal } = await journalAPI.getJournal(payload);

  return journal;
} 

// GET entry promise and set it to JSON
const getTerm = async () => {
  const payload = {
    id,
    date: today
  };
  const { data: term, success } = await journalAPI.getJournalTerm(payload);
  if(success){
    return term;
  }
};

// GET journal promise
const journal = getJournal();

// Create term if no term exists
journal.then(response => {
  if(response.terms.length === 0){
    const payload = {
      id,
      type: termType,
      startDate: today,
      endDate: endDate
    }
    journalAPI.addJournalTerm(payload);
  }
})
// Check if term exists for date, create term if it doesn't exist
getTerm().then(response => {
  if(response === undefined){
    const payload = {
      id,
      type: termType,
      startDate: today,
      endDate: endDate
    };

    journalAPI.addJournalTerm(payload);
  }
})

// GET term object
const term = getTerm();
term.then(response => console.log(`This is the term: `, response));

