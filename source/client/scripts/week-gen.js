/* eslint-disable no-unused-vars */
/* eslint-disable no-array-constructor */
/* eslint-disable no-underscore-dangle */
// Array of months
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
// Arrays of days in corresponding month
const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Gets array of date elements
const monthLabel = document.getElementsByClassName('date-number');

// Gets today's date
const today = new Date();

function getActualDay(date) {
  let day = date.getDay();
  if (day === 6) {
    day = 0;
  } else {
    day += 1;
  }
  return day;
}

function createCalendar() {
  // Grab today's year
  const currYear = today.getFullYear();
  // Grab today's month
  const currMonth = today.getMonth();
  // Get's the day of the week
  const currDay = getActualDay(today);

  // Have to subtract the number of days from today's day
  const whereStart = new Date(currYear, currMonth, 1);
  whereStart.setDate(today.getDate() - currDay + 1);

  const dates = [];

  let toSave;
  for (let i = 0; i < 7; i += 1) {
    toSave = whereStart.toString();
    dates.push(toSave);
    whereStart.setDate(whereStart.getDate() + 1);
  }

  return dates;
}

const magic = createCalendar();
const firstLabel = new Date(magic[0]);
const dayLabel = document.getElementsByClassName('date');
for (let i = 0; i < magic.length; i += 1) {
  const thatDay = new Date(magic[i]);
  dayLabel[i].innerHTML = `<a href="/daily">${thatDay.getDate()}</a>`;
}

function nextWeek() {
  const toSub = new Date(magic[0]);
  toSub.setDate(toSub.getDate() + 7);
  document.getElementById('month-label').innerHTML = `Week of ${
    toSub.getMonth() + 1
  }/${toSub.getDate()}`;
  for (let i = 0; i < 7; i += 1) {
    dayLabel[i].innerHTML = `<a href="/daily">${toSub.getDate()}</a>`;
    const saved = toSub.toString();
    magic[i] = saved;
    toSub.setDate(toSub.getDate() + 1);
  }
}

function prevWeek() {
  const toSub = new Date(magic[0]);
  toSub.setDate(toSub.getDate() - 7);
  document.getElementById('month-label').innerHTML = `Week of ${
    toSub.getMonth() + 1
  }/${toSub.getDate()}`;
  for (let i = 0; i < 7; i += 1) {
    dayLabel[i].innerHTML = `<a href="/daily">${toSub.getDate()}</a>`;
    const saved = toSub.toString();
    magic[i] = saved;
    toSub.setDate(toSub.getDate() + 1);
  }
}

// For mini calendar to right
// Initial calendar creation
function createMonthCalendar() {
  // Grabs today's year
  const currYear = today.getFullYear();
  // Grabs today's month
  const currMonth = today.getMonth();
  // First day worked on
  const firstDay = new Date(currYear, currMonth, 1);
  // What day is first day
  const numSpace = firstDay.getDay();
  // Array for dates
  const dates = new Array(Date);
  // Empty spaces for days of previous month
  for (let i = 0; i < numSpace; i += 1) {
    dates.push('');
  }
  // Populates dates
  for (let i = 0; i < numDays[currMonth]; i += 1) {
    dates.push(firstDay.getDate());
    firstDay.setDate(firstDay.getDate() + 1);
  }
  // More empty spaces
  for (let i = 0; i <= 14; i += 1) {
    dates.push('');
  }
  return dates;
}

function nextMonth() {
  let calcMonth;
  const currLabel = document.getElementById('current-month').innerHTML;
  for (let i = 0; i < monthNames.length; i += 1) {
    if (currLabel.includes(monthNames[i])) {
      calcMonth = i;
    }
  }

  const currYear = today.getFullYear();

  const firstDay = new Date(currYear, calcMonth + 1);
  const numSpace = firstDay.getDay();
  const boop = new Array(Date);

  for (let i = 0; i < numSpace; i += 1) {
    boop.push('');
  }

  for (let i = 0; i < numDays[calcMonth]; i += 1) {
    boop.push(firstDay.getDate());
    firstDay.setDate(firstDay.getDate() + 1);
  }

  for (let i = boop.length; i < 42; i += 1) {
    boop.push('');
  }

  for (let i = 0; i < boop.length; i += 1) {
    monthLabel[i].innerHTML = boop[i];
    monthLabel[i].style.backgroundColor = '#FFFFFF';
  }

  document.getElementById('current-month').innerHTML =
    monthNames[calcMonth + 1];
}

function prevMonth() {
  let _nextMonth;
  const currLabel = document.getElementById('current-month').innerHTML;
  for (let i = 0; i < monthNames.length; i += 1) {
    if (currLabel.includes(monthNames[i])) {
      _nextMonth = i;
    }
  }
  const currYear = today.getFullYear();

  const firstDay = new Date(currYear, nextMonth - 1);
  const numSpace = firstDay.getDay();
  const boop = new Array();

  for (let i = 0; i < numSpace; i += 1) {
    boop.push('');
  }

  for (let i = 0; i < numDays[nextMonth - 1]; i += 1) {
    boop.push(firstDay.getDate());
    firstDay.setDate(firstDay.getDate() + 1);
  }
  for (let i = boop.length; i < 42; i += 1) {
    boop.push('');
  }

  for (let i = 0; i < boop.length; i += 1) {
    monthLabel[i].innerHTML = boop[i];
    monthLabel[i].style.backgroundColor = '#FFFFFF';
  }
  document.getElementById('current-month').innerHTML = `${
    monthNames[nextMonth - 1]
  }`;
}

// Grabs array of dates
const addIn = createMonthCalendar();

document.getElementById('current-month').innerHTML = `${
  monthNames[today.getMonth()]
}`;

// Populates date elements
for (let i = 0; i < addIn.length; i += 1) {
  monthLabel[i].innerHTML = addIn[i];
  if (addIn[i] === today.getDate()) {
    monthLabel[i].style.backgroundColor = '#FFF192';
  }
}
