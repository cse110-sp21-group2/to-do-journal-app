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
// console.log(`Today's date: ${today}`);

// Current User
const user = session.getUser();
// Current user's id
// const id = user._id;
// TEST USER ID
const id = "60bebc3da19d7bd0468fed9d";
// console.log(`Print current user's id: ${id}`);

// Return "Quarter" or "Semester" DEFAULT: "Quarter"
let termType = user.term;
if(user.term === ""){
  termType= "Quarter";
}
// console.log(`Print term type: ${termType}`);

// SET end Date for end of quarter
let endDate = new Date();
endDate.setDate(endDate.getDate() + 77);
// console.log(`Quarter ends on this day: ${endDate}`);

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
// GET term ID
let tId = await term.then(response => {return response._id})
term.then(response => console.log(`This is the term: `, response));

const someTask = document.createElement('create-task');
/**
 * Make create-task interface pop-up when button is clicked
 * 
 * @params 
 * @return 
 */
function createTask() {
  document.querySelector('.main').appendChild(someTask);
}
// GET week number
let weekNum = 11-((Math.abs(endDate - today))/(1000 * 3600 * 24))/7;

// SET click function for add-task button
const addTaskBtns = document.querySelectorAll("#add-task");
addTaskBtns.forEach((btn) => {
  btn.addEventListener("click", createTask)
});
/**
 * This should grab the inputs and send it to MongoDB
 * 
 * @params
 * @return
 */
function submitTask() {
  const payload = {
    id,
    content: someTask.getTaskContent,
    dueDate: new Date(someTask.getEndDate),
    termId: tId,
    weekNumber: weekNum
  }

  console.log("content: ", payload.content);
  console.log("dueDate: ", payload.dueDate);
  console.log("Term ID: ", payload.termId);
  console.log("Week Number: ", payload.weekNumber);
  journalAPI.addTermTask(payload);
}
const saveTask = someTask.submitBtn;
saveTask.addEventListener("click", submitTask)

