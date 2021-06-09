/**
 * TODO:
 *      - Know when it's quarterly or semesterly(User Setting)
 *      - GET journal
 *      - GET entries (semester or quqarter)
 *      - Go through each entry to see if there exist an entry for current date
 *          - Make new entry otherwise based on date
 *      - In that entry, create new task
 */

// import session from './session';

const addTask = document.getElementById('add-task');
const taskSubmit = document.getElementsByClassName('menu-submit')[0];
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
taskSubmit.addEventListener('click', (event) => {
    closeOverlay();
});
