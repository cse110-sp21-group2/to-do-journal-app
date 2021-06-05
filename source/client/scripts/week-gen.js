// Array of months
const monthNames =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Arrays of days in corresponding month
const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function createCalendar() {
  // Grab today's date
  const today = new Date();
  // Grab today's year
  const currYear = today.getFullYear();
  // Grab today's month
  const currMonth = today.getMonth();
  // Get's the day of the week
  const currDay = getActualDay(today);

  // Have to subtract the number of days from today's day
  let whereStart = new Date(currYear, currMonth, 1);
  whereStart.setDate(today.getDate() - currDay + 1);


  let dates = [];

  for (let i = 0; i < 7; i+=1) {
    toSave = whereStart.toString();
    dates.push(toSave);
    whereStart.setDate(whereStart.getDate() + 1);
  }

return dates;
}

function getActualDay(date) {
  let day = date.getDay();
  if(day == 6) {
      day = 0;
  }
  else{
      day = day + 1;
  }
  return day;
}

function nextWeek() {
  let toSub = new Date(magic[0]);
  toSub.setDate(toSub.getDate() + 7);
  document.getElementById("month-label").innerHTML = "Week of " + (toSub.getMonth()+1) + "/" + toSub.getDate();
  for(let i = 0; i < 7; i++) {
    dayLabel[i].innerHTML = '<a href="daily.html">' + toSub.getDate()+ "</a>";
    let saved = toSub.toString();
    magic[i] = saved;
    toSub.setDate(toSub.getDate()+ 1);
  }
}

function prevWeek() {
  let toSub = new Date(magic[0]);
  toSub.setDate(toSub.getDate() - 7);
  document.getElementById("month-label").innerHTML = "Week of " + (toSub.getMonth()+1) + "/" + toSub.getDate();
  for(let i = 0; i < 7; i++) {
    dayLabel[i].innerHTML = '<a href="daily.html">' + toSub.getDate()+ "</a>";
    let saved = toSub.toString();
    magic[i] = saved;
    toSub.setDate(toSub.getDate()+ 1);
  }
}

let magic = createCalendar();
let firstLabel = new Date(magic[0]);
var dayLabel = document.getElementsByClassName("date");
for (let i = 0; i < magic.length; i+=1) {
  let thatDay = new Date(magic[i]);
  dayLabel[i].innerHTML = '<a href="daily.html">' + thatDay.getDate()+ "</a>";
}


// For mini calendar to right
// Initial calendar creation
function createMonthCalendar() {
  // Grabs today's date
  let today = new Date();
  // Grabs today's year
  let currYear = today.getFullYear();
  // Grabs today's month
  let currMonth = today.getMonth();
  // First day worked on
  let firstDay = new Date(currYear, currMonth, 1);
  // What day is first day
  let numSpace = firstDay.getDay();
  // Array for dates
  let dates = new Array();
  // Empty spaces for days of previous month
  for (let i = 0; i < numSpace; i++) {
    dates.push("");
  }
  // Populates dates
  for(let i = 0; i < numDays[currMonth]; i++) {
    dates.push(firstDay.getDate());
    firstDay.setDate(firstDay.getDate() + 1);
  }
  // More empty spaces
  for(let i = 0; i <= 14; i++) {
      dates.push("");
  }
  return dates;
  }

function nextMonth() {
  let calcMonth;
  let currLabel = document.getElementById("current-month").innerHTML;
  for(let i = 0; i < monthNames.length; i+=1) {
    if (currLabel.includes(monthNames[i])) {
      calcMonth = i;
    }
  }
      
  let today = new Date();
  let currYear = today.getFullYear();
    
  let firstDay = new Date(currYear, calcMonth+1);
  let numSpace = firstDay.getDay();
  let boop = new Array();

  for (let i = 0; i < numSpace; i++) {
    boop.push("");
  }

  for(let i = 0; i < numDays[calcMonth]; i+=1) {
    boop.push(firstDay.getDate());
    firstDay.setDate(firstDay.getDate() + 1);
  }

  for(let i = boop.length; i < 42; i+=1) {
    boop.push("");
  }

  for (let i = 0; i < boop.length; i+=1) {
    monthLabel[i].innerHTML = boop[i];
    monthLabel[i].style.backgroundColor = "#FFFFFF"
  }

  document.getElementById("current-month").innerHTML = monthNames[calcMonth+1]; 
  }

  function prevMonth() {
    let nextMonth;
    let currLabel = document.getElementById("current-month").innerHTML;
    for(let i = 0; i < monthNames.length; i++) {
      if (currLabel.includes(monthNames[i])) {
        nextMonth = i;
      }
    }
    let today = new Date();
    let currYear = today.getFullYear();
  
    let firstDay = new Date(currYear, nextMonth-1);
    let numSpace = firstDay.getDay();
    let boop = new Array();

    for (let i = 0; i < numSpace; i++) {
      boop.push("");
    }

    let numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for(let i = 0; i < numDays[nextMonth-1]; i+=1) {
      boop.push(firstDay.getDate());
      firstDay.setDate(firstDay.getDate() + 1);

    }
    for(let i = boop.length; i < 42; i+=1) {
      boop.push("");
    }

    for (let i = 0; i < boop.length; i+=1) {
      monthLabel[i].innerHTML = boop[i];
      monthLabel[i].style.backgroundColor = "#FFFFFF"
    }
    document.getElementById("current-month").innerHTML = `${monthNames[nextMonth-1]}`; 
}

// Grabs array of dates
let addIn = createMonthCalendar();
// Gets array of date elements 
const monthLabel = document.getElementsByClassName("date-number");
// Gets today's date
var today = new Date();
document.getElementById("current-month").innerHTML = `${monthNames[today.getMonth()]}`;
// Populates date elements 
for (let i = 0; i < addIn.length; i+=1) {
    monthLabel[i].innerHTML = addIn[i];
    if(addIn[i]==today.getDate()) {
        monthLabel[i].style.backgroundColor = "#FFF192";
    }
}
