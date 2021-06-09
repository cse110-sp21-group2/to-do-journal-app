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
 if (!session.isUserLoggedIn()) {
    // eslint-disable-next-line no-alert
    alert('You must sign in to view your journal');
    window.location.href = '/signin';
  }
// GET user 
const user = session.getUser();
// GET user ID 
// const id = user._id;
// Test User ID
const id = "60bebc3da19d7bd0468fed9d";


//To Display all the jounral entries 



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


//


// GET journal promise
const journal = getJournal();
// GET Date
const today = new Date();


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
  document.querySelector('.main').appendChild(newTask);
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
    entryDate: new Date(newTask.getStartDate),
    type: 'Daily'
  };

  const { success } = await journalAPI.addEntryTask(payload);
  console.log(success);
}

// GET submit button and save value to mongoDB
const saveTask = newTask.submitBtn;
saveTask.addEventListener("click", submitTask);

// DISPLAY task
entry.then(res => res.tasks.forEach((task) => {
  const newTask = document.createElement('task-toggle');
  newTask.content = task;
  const taskDate = new Date(task.dueDate);
  newTask.date = taskDate;
  document.querySelector('.tasks-content').appendChild(newTask);
}))