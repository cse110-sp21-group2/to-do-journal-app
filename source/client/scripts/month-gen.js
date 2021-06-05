
  // Array of months
  const monthNames =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // Arrays of days in corresponding month
  const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // Initial calendar creation
  function createCalendar() {
    // Grabs today's date
    const today = new Date();
    // Grabs today's year
    const currYear = today.getFullYear();
    // Grabs today's month
    const currMonth = today.getMonth();
    // First day worked on
    const firstDay = new Date(currYear, currMonth, 1);
    // What day is first day
    const numSpace = firstDay.getDay();
    // Array for dates
    const dates = [];
    // Empty spaces for days of previous month
    for(let i = 0; i < numSpace; i+=1) {
      dates.push("");
    }

    // Populates dates
    for(let i = 0; i < numDays[currMonth]; i+=1) {
      const toSave = firstDay.toString();
      dates.push(toSave);
      firstDay.setDate(firstDay.getDate() + 1);
     }
    // More empty spaces
    for(let i = 0; i <= 14; i+=1) {
        dates.push("");
    }
    return dates;
  }
 
  /*
  // Gets the date of week, accounting for JS shift
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
  */

  function nextMonth() {
    let next_Month;
    const currLabel = document.getElementById("month-label").innerHTML;
    for(let i = 0; i < monthNames.length; i+=1) {
      if (currLabel.includes(monthNames[i])) {
        next_Month = i;
      }
    }
    const grabYear = currLabel.substring(currLabel.length-4, currLabel.length);

    let assignMonth;
    if((next_Month+1) > 11) {
      assignMonth = 0;
    }
    else {
      assignMonth = parseInt(next_Month) + 1;
    }

    //const today = new Date();

    let nextYear = grabYear;
    if(assignMonth == 0) {
      nextYear = parseInt(grabYear) + 1;
    }
    else {
      nextYear = grabYear;
    }
    
    let firstDay = new Date(nextYear, assignMonth);

    let numSpace = firstDay.getDay();
    let boop = new Array();

    for (let i = 0; i < numSpace; i++) {
      boop.push("");
    }

    for(let i = 0; i < numDays[assignMonth]; i+=1) {
      boop.push(firstDay.getDate());
      firstDay.setDate(firstDay.getDate() + 1);
    }
    
    for(let i = boop.length; i < 42; i+=1) {
      boop.push("");
    }
      
    for (let i = 0; i < boop.length; i+=1) {
      dayLabel[i].innerHTML = `<a href="daily.html"> ${boop[i]} </a>`;
      dayLabel[i].style.backgroundColor = "#FFFFFF"
    }

    document.getElementById("month-label").innerHTML = `${monthNames[assignMonth]} ${nextYear}`; 
  }

  function prevMonth() {
    let nextMonth;
    let currLabel = document.getElementById("month-label").innerHTML;

    for(let i = 0; i < monthNames.length; i+=1) {
      if (currLabel.includes(monthNames[i])) {
        nextMonth = i;
      }
    }

    let grabYear = currLabel.substring(currLabel.length-4, currLabel.length);

    let assignMonth;
    if((nextMonth-1) < 0) {
      assignMonth = 11;
    }
    else {
      assignMonth = nextMonth - 1;
    }

    //let today = new Date();
    
    let nextYear;
    if(assignMonth == 11) {
      nextYear = grabYear - 1;
    }
    else {
      nextYear = grabYear;
    }
  
    let firstDay = new Date(nextYear, assignMonth);
    let numSpace = firstDay.getDay();
    let boop = new Array();

    for (let i = 0; i < numSpace; i+=1) {
      boop.push("");
    }

    for(let i = 0; i < numDays[assignMonth]; i+=1) {
      boop.push(firstDay.getDate());
      firstDay.setDate(firstDay.getDate() + 1);

    }
    for(let i = boop.length; i < 42; i+=1) {
      boop.push("");
    }

    for (let i = 0; i < boop.length; i++) {
      dayLabel[i].innerHTML = `<a href="daily.html"> ${boop[i]} </a>`;
      dayLabel[i].style.backgroundColor = "#FFFFFF"
    }
    
    document.getElementById("month-label").innerHTML = `${monthNames[assignMonth]} ${nextYear}`; 
}

  // Grabs array of dates
  const addIn = createCalendar();
  // Gets array of date elements 
  let dayLabel = document.getElementsByClassName("date-number");
  // Gets today's date
  const today = new Date();
  document.getElementById("month-label").innerHTML = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
  
  // Populates date elements 
  for (let i = 0; i < addIn.length; i+=1) {
    if(addIn[i] !== "") {  
      const populate = new Date(addIn[i]);
      dayLabel[i].innerHTML = `<a href="daily.html"> ${populate.getDate()} </a>`;
      if(addIn[i]===today.getDate()) {
          dayLabel[i].style.backgroundColor = "#FFF192";
      }
    }
  }
        
    