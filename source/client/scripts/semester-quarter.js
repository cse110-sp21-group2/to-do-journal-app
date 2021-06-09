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

const addTask = document.getElementById('add-task');
// const taskSubmit = document.getElementsByClassName('menu-submit')[0];
const taskOverlay = document.getElementById('task-overlay');

// if (!session.isUserLoggedIn()) {
//   // eslint-disable-next-line no-alert
//   alert('You must sign in to view your journal');
//   window.location.href = '/signin';
// }

// open either the add task or add event overlay
function openOverlay(menu) {
    console.log(menu.style.visibility);
    menu.style.visibility = "visible";
}

// close menu overlay
function closeOverlay() {
    taskOverlay.style.visibility = "hidden";
}

// ON CLICK of add task button - open the add task menu
addTask.addEventListener('click', (event) => {
    openOverlay(taskOverlay);
});

// ON CLICK of task submit button - close menu
// taskSubmit.addEventListener('click', (event) => {
//     closeOverlay();
// });

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
if ( termType === "Quarter"){
  endDate.setDate(endDate.getDate() + 77);
  // Else we're in a semester
} else {
  endDate.setDate(endDate.getDate() + 112);
}
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
const getTerm = async (someDate) => {
  const payload1 = {
    id,
    date: someDate
  };
  const { data: term, success } = await journalAPI.getJournalTerm(payload1);
  if(success){
    return term;
    // Else create a term 
  } else {
    let someEndDate = someDate;
    if ( termType === "Quarter") {
      someEndDate.setDate(someEndDate.getDate() + 77);
    } else {
      someEndDate.setDate(someEndDate.getDate() + 112);
    }
    const payload2 = {
      id,
      type: termType,
      startDate: someDate,
      endDate: someEndDate
    }
    journalAPI.addJournalTerm(payload2);

    const payload3 = {
      id,
      date: someDate
    }
    const { data: term } = await journalAPI.getJournalTerm(payload3);
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

// GET term object
const term = getTerm(today);
// GET term ID
let tId = await term.then(response =>  {return response._id});
console.log(tId);
term.then(response => console.log(`This is the term: `, response));

const someTask = document.createElement('create-task');
/**
 * Make create-task interface pop-up when button is clicked
 */
function createTask() {
  document.querySelector('.main').appendChild(someTask);
}

let currWeek = 11 - ((Math.abs(endDate - today)) / (1000 * 3600 * 24)) / 7;

// GET week number based on the button we click
let weekNum = 0;
function setWeekNum(){
  weekNum = Number(this.getAttribute("name"));
  console.log("weekNum=", weekNum);
}
// GET week number

// SET click function for add-task button
const addTaskBtns = document.querySelectorAll("#add-task");
let counter =0;
addTaskBtns.forEach((btn) => {
  btn.addEventListener("click", createTask)
  btn.setAttribute("name", counter);
  btn.addEventListener("click", setWeekNum);
  counter++;
});

/**
 * Grab the inputs and send it to MongoDB
 */
function submitTask() {
  const payload = {
    id,
    content: someTask.getTaskContent,
    dueDate: new Date(someTask.getEndDate),
    termId: tId,
    weekNumber: weekNum
  }

  journalAPI.addTermTask(payload);
}
// GET submit button and save value to mongoDB
const saveTask = someTask.submitBtn;
saveTask.addEventListener("click", submitTask)

// GET tasks and notes for specific week and display it
function displayItems(specificTerm) {
  let weekCount = 0;
  specificTerm.then(res => res.weeks.forEach((week) => {
    week.tasks.forEach((task) => {
      const newTask = document.createElement('task-toggle');
      newTask.content = task;
      const taskDate = new Date(task.dueDate);
      newTask.date = taskDate;
      document.querySelector(`#task-container-${weekCount}`).appendChild(newTask);
    })
    week.notes.forEach((note) => {
      const newNote = document.createElement('note-toggle');
      newNote.content = note;
      document.querySelector(`#task-container-${weekCount}`);
    })
    weekCount++;
  }
  ));
}
// DISPLAY when page first loads
displayItems(term);

function removeAllTasksAndNotes(parent) {
  parent.innerHTML = '';
}

/**
 * Creates new term, display it
 * Forward arrow function
 * 
 * NOT DONE
 */
function nextTerm(){
  const currentPeriodTitle = document.querySelector(".currentPeriod");
  const notesContain = document.querySelectorAll(".notes-container");
  const tasksContain = document.querySelectorAll(".task-container");
  tasksContain.forEach((taskContainer) => {
    removeAllTasksAndNotes(taskContainer);
  })
  notesContain.forEach((noteContainer) =>{
    removeAllTasksAndNotes(noteContainer);
  })
  // SET new term and display 
  let newTermStartDate = new Date();
  let newTermEndDate = newTermStartDate;
  newTermStartDate = journal.then(response => { return new Date(response.terms[response.terms.length-1].endDate)});
  newTermEndDate = newTermStartDate.then(response =>{return response});
  if (termType === "Quarter") {
    newTermEndDate.setDate(newTermEndDate.getDate() + 77);
  } else {
    newTermEndDate.setDate(newTermEndDate.getDate() + 112);
  }
  // const moreTerm = getTerm(newTermStartDate);
  // displayItems(moreTerm);
}
const forwardBtn = document.querySelector(".forward-button");
forwardBtn.addEventListener("click", nextTerm);


/**
 * TODO:
 * - Arrows switching to different quarters/semester
 * - Down arrow see other weeks
 * - Fix CSS for display notes and tasks
 * - Fix create-task pop up interface
 * - Week logic (when clicking button, write to correct week in mongo)
 */
