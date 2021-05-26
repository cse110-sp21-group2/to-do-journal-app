/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const journalAPI = {};

/**
 * Creates a new Journal.
 * @param {object} id - User Id
 * @returns {object} New Journal
 */
journalAPI.createJournal = async (id) => {
  const url = `/api/create-journal/${id}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Gets journal in relation to the User
 * @param {string} id -User Id
 * @returns {object} New journal entry.
 */
journalAPI.getJournal = async (id) => {
  const url = `/api/journal/${id}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Gets journal entry.
 * @param {string} id - User Id
 * @param {Date} date - Date for this entry
 * @param {string} type - Type of entry
 * @returns {object} Journal entry for this date
 */
journalAPI.getJournalEntry = async (id, date, type) => {
  const url = `/api/journal-entry/${id}&${date}&${type}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Gets journal entries.
 * @param {string} id - User Id
 * @param {Date} fromDate - Starting date for journal entries
 * @param {Date} toDate - End date for journal entries
 * @param {string} type - Type of entries
 * @returns {object} All journal entries within this range (inclusive)
 */
journalAPI.getJournalEntries = async (id, fromDate, toDate, type) => {
  const url = `/api/journal-entries/${id}&${fromDate}&${toDate}&${type}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Adds a new journal entry.
 * @param {string} id - User Id
 * @param {Date} date - Date for this entry
 * @param {string} type - Type of entry
 * @returns {object} New Entry
 */
journalAPI.addJournalEntry = async (id, date, type) => {
  const url = `/api/add-journal-entry/${id}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      date,
      type,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Adds a new task.
 * @param {string} id - User Id
 * @param {string} content - Task content
 * @param {Date} dueDate - Due date for task
 * @param {Date} entry - Date for journal entry
 * @param {string} type - Type of journal entry
 * @returns {object} New task.
 */
journalAPI.addTask = async (id, content, entryDate, dueDate, type) => {
  const url = `/api/add-task/${id}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      dueDate,
      entryDate,
      type,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Updates a task.
 * @param {string} id - User Id
 * @param {string} taskId - Id for this task
 * @param {string} content - Updated text for this task
 * @param {Date} dueDate - Date task is due
 * @param {Date} entryDate - Date for journal entry this task belongs to
 * @param {string} type - Type of journal entry
 * @returns {object} Updated task
 */
journalAPI.updateTask = async (
  id,
  taskId,
  content,
  dueDate,
  entryDate,
  type
) => {
  const url = `/api/update-task/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      taskId,
      content,
      entryDate,
      dueDate,
      type,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Deletes a task.
 * @param {string} id - Id for this user.
 * @param {string} taskId - Id for this task.
 * @param {Date} entryDate - Date for this journal entry
 * @param {string} type - Type of journal entry this task is related to.
 *
 */
journalAPI.deleteTask = async (id, taskId, entryDate, type) => {
  const url = `/api/delete-task/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      taskId,
      entryDate,
      type,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Adds a new note.
 * @param {string} id - User Id
 * @param {string} content - Note content
 * @param {Date} entryDate - Date for journal entry
 * @param {string} type - Type of journal entry
 * @returns {object} New note.
 */
journalAPI.addNote = async (id, content, entryDate, type) => {
  const url = `/api/add-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      type,
      entryDate,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Updates a note.
 * @param {string} id - User Id
 * @param {string} noteId - Id for this note
 * @param {string} content - Updated text for this Note
 * @param {Date} entryDate - Date for journal entry this note belongs to
 * @param {string} type - Type of journal entry
 * @returns {object} Updated note
 */
journalAPI.updateNote = async (id, noteId, content, entryDate, type) => {
  const url = `/api/update-note/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      noteId,
      content,
      type,
      entryDate,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Deletes a note.
 * @param {string} id - Id for this user.
 * @param {string} noteId - Id for this note.
 * @param {Date} entryDate - Date for this journal entry
 * @param {string} type - Type of journal entry this task is related to.
 *
 */
journalAPI.deleteNote = async (id, noteId, entryDate, type) => {
  const url = `/api/delete-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      noteId,
      entryDate,
      type,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Adds a new event.
 * @param {string} id - User Id
 * @param {string} content - Event content
 * @param {string} link - URL link
 * @param {Date} entryDate - Date for journal entry
 * @param {string} type - Type of journal entry
 * @returns {object} New event.
 */
journalAPI.addEvent = async (id, content, link, entryDate, type) => {
  const url = `/api/add-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      type,
      entryDate,
      content,
      link,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Updates an event.
 * @param {string} id - User Id
 * @param {string} content - Updated event content
 * @param {string} link - URL link
 * @param {Date} entryDate - Date for journal entry
 * @param {string} type - Type of journal entry
 * @returns {object} Updated event
 */
journalAPI.updateEvent = async (id, content, link, entryDate, type) => {
  const url = `/api/update-event/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      content,
      entryDate,
      type,
      link,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Deletes an event.
 * @param {string} id - Id for this user.
 * @param {string} eventId - Id for this event.
 * @param {Date} entryDate - Date for this journal entry
 * @param {string} type - Type of journal entry this event is related to.
 *
 */
journalAPI.deleteEvent = async (id, eventId, entryDate, type) => {
  const url = `/api/delete-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      eventId,
      entryDate,
      type,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

export default journalAPI;
