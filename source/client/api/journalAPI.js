/* eslint-disable no-shadow */
/* eslint-disable no-console */
const journalAPI = {};

/**
 * Creates a new Journal.
 * @param {object} id - User Id.
 * @returns {object} journal.
 */
journalAPI.createJournal = async ({ id }) => {
  const url = `/api/create-journal/${id}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Gets User Journal.
 * @param {string} id -User Id.
 * @returns {object} journal.
 */
journalAPI.getJournal = async ({ id }) => {
  const url = `/api/journal/${id}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Gets a journal collection.
 * @param {string} id -User Id.
 * @param {string} collectionId - Collection Id.
 * @returns {object} collection.
 */
journalAPI.getJournalCollection = async ({ id, collectionId }) => {
  const url = `/api/journal/${id}&${collectionId}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Gets journal entry.
 * @param {string} id - User Id.
 * @param {Date} date - Date for this journal entry.
 * @param {string} type - Type of journal entry.
 * @returns {object} entry.
 */
journalAPI.getJournalEntry = async ({ id, date, type }) => {
  const url = `/api/journal-entry/${id}&${date}&${type}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Gets journal entries.
 * @param {string} id - User Id.
 * @param {Date} fromDate - Starting date for journal entries.
 * @param {Date} toDate - End date for journal entries.
 * @param {string} type - Type of journal entries.
 * @returns {object} filteredEntries.
 */
journalAPI.getJournalEntries = async ({
  id,
  fromDate,
  toDate,
  type,
}) => {
  const url = `/api/journal-entries/${id}&${fromDate}&${toDate}&${type}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Adds a new journal entry.
 * @param {string} id - User Id.
 * @param {Date} date - Date for this journal entry.
 * @param {string} type - Type of journal entry.
 * @returns {object} newEntry.
 */
journalAPI.addJournalEntry = async ({ id, date, type }) => {
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
 * Adds a new journal collection.
 * @param {string} id - User Id.
 * @param {string} name - Name for this new collection.
 * @returns {object} newCollection.
 */
journalAPI.addJournalCollection = async ({ id, name }) => {
  const url = `/api/add-journal-entry/${id}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      name,
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
 * @param {string} id - User Id.
 * @param {string} content - Task content.
 * @param {Date} dueDate - Due date for task.
 * @param {string} collectionId - Collection Id.
 * @param {Date} entryDate - Date for this journal entry.
 * @param {string} type - Type of journal entry.
 * @returns {object} newTask.
 */
journalAPI.addTask = async ({
  id,
  content,
  collectionId = null,
  entryDate = null,
  dueDate,
  type,
}) => {
  const url = `/api/add-task/${id}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      dueDate,
      collectionId,
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
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {string} content - Updated text for this task.
 * @param {Date} dueDate - Date task is due.
 * @param {string} collectionId - Collection Id.
 * @param {Date} entryDate - Date for journal entry this task belongs to.
 * @param {string} type - Type of journal entry.
 * @returns {object} updatedTask.
 */
journalAPI.updateTask = async ({
  id,
  taskId,
  content,
  dueDate,
  collectionId = null,
  entryDate = null,
  type,
}) => {
  const url = `/api/update-task/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      taskId,
      content,
      collectionId,
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
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {string} collectionId - Collection Id.
 * @param {Date} entryDate - Date for journal entry this task belongs to.
 * @param {string} type - Type of journal entry this task belongs to.
 * @returns {boolean} success.
 */
journalAPI.deleteTask = async ({
  id,
  taskId,
  collectionId = null,
  entryDate = null,
  type,
}) => {
  const url = `/api/delete-task/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      taskId,
      collectionId,
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
 * @param {string} id - User Id.
 * @param {string} content - Note content.
 * @param {string} collectionId - Collection Id.
 * @param {Date} entryDate - Date for this journal entry.
 * @param {string} type - Type of journal entry.
 * @returns {object} newNote.
 */
journalAPI.addNote = async ({
  id,
  content,
  collectionId = null,
  entryDate = null,
  type,
}) => {
  const url = `/api/add-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      collectionId,
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
 * Updates a note.
 * @param {string} id - User Id.
 * @param {string} noteId - Note Id.
 * @param {string} content - Note contents.
 * @param {string|undefined} collectionId - Collection Id (if this is a collection).
 * @param {Date|undefined} entryDate - Journal Entry Date (if this is an entry).
 * @param {string} type - Type of journal entry this note belongs to.
 * @returns {object} updatedNote.
 */
journalAPI.updateNote = async ({
  id,
  noteId,
  content,
  collectionId = null,
  entryDate = null,
  type,
}) => {
  const url = `/api/update-note/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      noteId,
      content,
      collectionId,
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
 * Deletes a note.
 * @param {string} id - User Id.
 * @param {string} noteId - Note Id.
 * @param {string|undefined} collectionId - Collection Id (if this is a collection).
 * @param {Date|undefined} entryDate - Journal Entry Date (if this is an entry).
 * @param {string} type - Type of journal entry this note belongs to.
 * @returns {boolean} success.
 */
journalAPI.deleteNote = async ({
  id,
  noteId,
  collectionId = null,
  entryDate = null,
  type,
}) => {
  const url = `/api/delete-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      noteId,
      collectionId,
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
 * @param {string} id - User Id.
 * @param {string} content - Event content.
 * @param {string} link - URL link.
 * @param {Date} startTime - Start time for this event.
 * @param {Date} endTime - End time for this event.
 * @param {string|undefined} collectionId - Collection Id (if this is a collection).
 * @param {Date|undefined} entryDate - Journal Entry Date (if this is an entry).
 * @param {string} type - Type of journal entry this event belongs to.
 * @returns {object} newEvent.
 */
journalAPI.addEvent = async ({
  id,
  content,
  startTime,
  endTime,
  link,
  collectionId = null,
  entryDate = null,
  type,
}) => {
  const url = `/api/add-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      startTime,
      endTime,
      link,
      collectionId,
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
 * Updates an event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string} content - Updated event content.
 * @param {string} link - URL link.
 * @param {Date} startTime - Start time for this event.
 * @param {Date} endTime - End time for this event.
 * @param {string|undefined} collectionId - Collection Id (if this is a collection).
 * @param {Date|undefined} entryDate - Journal Entry Date (if this is an entry).
 * @param {string} type - Type of journal entry this event belongs to.
 * @returns {object} updatedEvent.
 */
journalAPI.updateEvent = async ({
  id,
  eventId,
  content,
  link,
  startTime,
  endTime,
  collectionId = null,
  entryDate = null,
  type,
}) => {
  const url = `/api/update-event/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      eventId,
      content,
      link,
      startTime,
      endTime,
      collectionId,
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
 * Deletes an event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string|undefined} collectionId - Collection Id (if this is a collection).
 * @param {Date|undefined} entryDate - Journal Entry Date (if this is an entry).
 * @param {string} type - Type of journal entry this event belongs to.
 * @returns {boolean} Success status.
 */
journalAPI.deleteEvent = async ({
  id,
  eventId,
  collectionId = null,
  entryDate = null,
  type,
}) => {
  const url = `/api/delete-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      eventId,
      collectionId,
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
 * Migrates a task.
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {string} content - Task content.
 * @param {Date} dueDate - Due date for task if applicable.
 * @param {Date} entryDate - Date for journal entry this task belongs to.
 * @param {Date} migrateDate - Date for journal entry this task is being moved to.
 * @param {string} type - Type of journal entry this task belongs to.
 * @returns {object} Migrated task.
 */
journalAPI.migrateTask = async ({
  id,
  taskId,
  content,
  entryDate,
  dueDate,
  migrateDate,
  type,
}) => {
  const url = `/api/migrate-task/${id}`;

  // id, taskId, content, entryDate, dueDate, migrateDate, type
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      taskId,
      entryDate,
      content,
      dueDate,
      migrateDate,
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
 * Migrates a note.
 * @param {string} id - User Id.
 * @param {string} noteId - Note Id.
 * @param {string} content - Note content.
 * @param {Date} entryDate - Date for journal entry this note belongs to.
 * @param {Date} migrateDate - Date for journal entry this note is being moved to.
 * @param {string} type - Type of journal entry this note belongs to.
 * @returns {object} Migrated note.
 */
journalAPI.migrateNote = async ({
  id,
  noteId,
  content,
  entryDate,
  migrateDate,
  type,
}) => {
  const url = `/api/migrate-note/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      noteId,
      content,
      entryDate,
      migrateDate,
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
 * Migrates an event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string} content - Event content.
 * @param {Date} entryDate - Date for journal entry this event belongs to.
 * @param {Date} migrateDate - Date for journal entry this event is being moved to.
 * @param {string} type - Type of journal entry this event belongs to.
 * @returns {object} Migrated event.
 */
journalAPI.migrateEvent = async ({
  id,
  eventId,
  content,
  entryDate,
  migrateDate,
  type,
}) => {
  const url = `/api/migrate-event/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      eventId,
      content,
      entryDate,
      migrateDate,
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
