import session from './session.js';
import journalAPI from '../api/journalAPI.js';

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

// Test User ID
const id = "60bebc3da19d7bd0468fed9d";



/**
 * Getting journal for that specific userid from journalAPI
 *  @returns {object} Journal.
 */
//  const getJournal = async () => {
//     const payload = {
//       id
//     };
//     const { data: journal } = await journalAPI.getJournal(payload);
//     return journal;
//   } 

// GET journal promise
// const journal = getJournal();
const today_date = document.querySelector(".daily-date").innerText;

const today = Date();
const newTask = document.createElement('create-task');


// SET click function for add-task button
const addTaskBtn = document.querySelectorAll("#add-task")[0];
addTaskBtn.addEventListener('click',createTask);


  // GET submit button and save value to mongoDB
  const saveTask = newTask.submitBtn;
  saveTask.addEventListener("click", submitTask);




/**
 * Make create-task interface pop-up when button is clicked
 */
 function createTask() {
    document.querySelector('#tasks-container').appendChild(newTask);
  }
/**
 * Grab the inputs and send it to MongoDB
 */
 function submitTask() {
    const payload = {
      id,
      content: newTask.getTaskContent,
      dueDate: new Date(newTask.getEndDate),
      entryDate: new Date(newTask.getStartDate),
      type:'Daily'
    };
  
    journalAPI.addEntryTask(payload);
  }
  