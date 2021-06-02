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
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
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
 * @param {string} type - Type of journal entries: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} filteredEntries.
 */
journalAPI.getJournalEntries = async ({ id, fromDate, toDate, type }) => {
  const url = `/api/journal-entries/${id}&${fromDate}&${toDate}&${type}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Adds a new journal entry.
 * @param {string} id - User Id.
 * @param {Date} date - Date for this journal entry.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
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
 * Adds a new journal term.
 * @param {string} id - User Id.
 * @param {string} type - Type of academic term, i.e., Quarter or Semester
 * @returns {object} newCollection.
 */
journalAPI.addJournalTerm = async ({ id, type }) => {
  const url = `/api/add-journal-term/${id}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
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
  const url = `/api/add-journal-collection/${id}`;
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
 * Adds a new entry task.
 * @param {string} id - User Id.
 * @param {string} content - Task content.
 * @param {Date} dueDate - Due date for task.
 * @param {Date} entryDate - Date for this journal entry.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} newTask.
 */
journalAPI.addEntryTask = async ({ id, content, dueDate, entryDate, type }) => {
  const url = `/api/add-entry-task/${id}`;
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
 * Adds a new term task.
 * @param {string} id - User Id.
 * @param {string} content - Task content.
 * @param {Date} dueDate - Due date for task.
 * @param {string} termId - Term Id.
 * @param {number} weekNumber - Week number for this term.
 * @returns {object} newTask.
 */
journalAPI.addTermTask = async ({ id, content, dueDate, termId, weekNumber }) => {
  const url = `/api/add-term-task/${id}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      dueDate,
      termId,
      weekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Updates a entry task.
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {string} content - Updated text for this task.
 * @param {Date} dueDate - Date task is due.
 * @param {Date} entryDate - Date for journal entry this task belongs to.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} updatedTask.
 */
journalAPI.updateEntryTask = async ({
  id,
  taskId,
  content,
  dueDate,
  entryDate,
  type,
}) => {
  const url = `/api/update-entry-task/${id}`;

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
 * Updates a term task.
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {string} content - Updated text for this task.
 * @param {Date} dueDate - Date task is due.
 * @param {Date} termId - Term Id.
 * @param {string} weekNumber - Week number for this term.
 * @returns {object} updatedTask.
 */
journalAPI.updateTermTask = async ({
  id,
  taskId,
  content,
  dueDate,
  termId,
  weekNumber,
}) => {
  const url = `/api/update-term-task/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      taskId,
      content,
      dueDate,
      termId,
      weekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Deletes a entry task.
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {Date} entryDate - Date for journal entry this task belongs to.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {boolean} success.
 */
journalAPI.deleteEntryTask = async ({ id, taskId, entryDate, type }) => {
  const url = `/api/delete-entry-task/${id}`;

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
 * Deletes a term task.
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {string} termId - Term Id.
 * @param {string} weekNumber - Week number for this task.
 * @returns {boolean} success.
 */
journalAPI.deleteTermTask = async ({ id, taskId, termId, weekNumber }) => {
  const url = `/api/delete-term-task/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      taskId,
      termId,
      weekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Adds a new entry note.
 * @param {string} id - User Id.
 * @param {string} content - Note content.
 * @param {Date} entryDate - Date for this journal entry.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} newNote.
 */
journalAPI.addEntryNote = async ({ id, content, entryDate, type }) => {
  const url = `/api/add-entry-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
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
 * Adds a new term note.
 * @param {string} id - User Id.
 * @param {string} content - Note content.
 * @param {string} termId - Term Id.
 * @param {string} weekNumber - Week number for this term.
 * @returns {object} newNote.
 */
journalAPI.addTermNote = async ({ id, content, termId, weekNumber }) => {
  const url = `/api/add-term-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      termId,
      weekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Adds a new collection note.
 * @param {string} id - User Id.
 * @param {string} content - Note content.
 * @param {string} collectionId - Collection Id.
 * @returns {object} newNote.
 */
journalAPI.addCollectionNote = async ({ id, content, collectionId }) => {
  const url = `/api/add-collection-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      collectionId,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Updates a entry note.
 * @param {string} id - User Id.
 * @param {string} noteId - Note Id.
 * @param {string} content - Note contents.
 * @param {Date} entryDate - Date for this journal entry.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} updatedNote.
 */
journalAPI.updateEntryNote = async ({ id, noteId, content, entryDate, type }) => {
  const url = `/api/update-entry-note/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      noteId,
      content,
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
 * Updates a term note.
 * @param {string} id - User Id.
 * @param {string} noteId - Note Id.
 * @param {string} content - Note contents.
 * @param {string} termId - Term Id.
 * @param {number} weekNumber - Week number for this term.
 * @returns {object} updatedNote.
 */
journalAPI.updateTermNote = async ({ id, noteId, content, termId, weekNumber, type }) => {
  const url = `/api/update-term-note/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      noteId,
      content,
      termId,
      weekNumber,
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
 * Updates a collection note.
 * @param {string} id - User Id.
 * @param {string} noteId - Note Id.
 * @param {string} content - Note contents.
 * @param {string} collectionId - Collection Id.
 * @returns {object} updatedNote.
 */
journalAPI.updateCollectionNote = async ({ id, noteId, content, collectionId }) => {
  const url = `/api/update-collection-note/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      noteId,
      content,
      collectionId,
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
 * @param {Date} entryDate - Journal Entry Date.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {boolean} success.
 */
journalAPI.deleteEntryNote = async ({ id, noteId, entryDate, type }) => {
  const url = `/api/delete-entry-note/${id}`;

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
 * Deletes a note.
 * @param {string} id - User Id.
 * @param {string} noteId - Note Id.
 * @param {string} termId - Term Id.
 * @param {number} weekNumber - Week number for this term.
 * @returns {boolean} success.
 */
journalAPI.deleteTermNote = async ({ id, noteId, termId, weekNumber }) => {
  const url = `/api/delete-term-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      noteId,
      termId,
      weekNumber,
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
 * @param {string} collectionId - Collection Id.
 * @returns {boolean} success.
 */
journalAPI.deleteCollectionNote = async ({ id, noteId, collectionId }) => {
  const url = `/api/delete-collection-note/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      noteId,
      collectionId,
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
 * @param {string} url - URL.
 * @param {Date} startTime - Start time for this event.
 * @param {Date} endTime - End time for this event.
 * @param {Date} entryDate - Date for this journal entry.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} newEvent.
 */
journalAPI.addEntryEvent = async ({
  id,
  content,
  startTime,
  endTime,
  URL,
  entryDate,
  type,
}) => {
  const url = `/api/add-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      startTime,
      endTime,
      URL,
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
 * @param {string} url - URL.
 * @param {Date} startTime - Start time for this event.
 * @param {Date} endTime - End time for this event.
 * @param {string} termId - Term Id.
 * @param {number} weekNumber - Week number for this term.
 * @returns {object} newEvent.
 */
journalAPI.addTermEvent = async ({
  id,
  content,
  startTime,
  endTime,
  URL,
  termId,
  weekNumber,
}) => {
  const url = `/api/add-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      startTime,
      endTime,
      URL,
      termId,
      weekNumber,
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
 * @param {string} URL - URL.
 * @param {Date} startTime - Start time for this event.
 * @param {Date} endTime - End time for this event.
 * @param {string} collectionId - Collection Id.
 * @returns {object} newEvent.
 */
journalAPI.addCollectionEvent = async ({
  id,
  content,
  startTime,
  endTime,
  URL,
  collectionId,
}) => {
  const url = `/api/add-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      content,
      startTime,
      endTime,
      URL,
      collectionId,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Updates a entry event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string} content - Updated event content.
 * @param {string} url - URL.
 * @param {Date} startTime - Start time for this event.
 * @param {Date} endTime - End time for this event.
 * @param {Date} entryDate - Date for this journal entry.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} updatedEvent.
 */
journalAPI.updateEntryEvent = async ({
  id,
  eventId,
  content,
  URL,
  startTime,
  endTime,
  entryDate,
  type,
}) => {
  const url = `/api/update-entry-event/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      eventId,
      content,
      URL,
      startTime,
      endTime,
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
 * Updates a term event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string} content - Updated event content.
 * @param {string} URL - URL.
 * @param {Date} startTime - Start time for this event.
 * @param {Date} endTime - End time for this event.
 * @param {string} termId - Term Id.
 * @param {number} weekNumber - Week number for this term.
 * @returns {object} updatedEvent.
 */
journalAPI.updateTermEvent = async ({
  id,
  eventId,
  content,
  URL,
  startTime,
  endTime,
  termId,
  weekNumber,
}) => {
  const url = `/api/update-term-event/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      eventId,
      content,
      URL,
      startTime,
      endTime,
      termId,
      weekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Updates a collection event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string} content - Updated event content.
 * @param {string} URL - URL.
 * @param {Date} startTime - Start time for this event.
 * @param {Date} endTime - End time for this event.
 * @param {string} collectionId - Collection Id.
 * @returns {object} updatedEvent.
 */
journalAPI.updateCollectionEvent = async ({
  id,
  eventId,
  content,
  URL,
  startTime,
  endTime,
  collectionId,
}) => {
  const url = `/api/update-collection-event/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      eventId,
      content,
      URL,
      startTime,
      endTime,
      collectionId,
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
 * @param {Date} entryDate - Journal Entry Date (if this is an entry).
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {boolean} Success status.
 */
journalAPI.deleteEntryEvent = async ({ id, eventId, entryDate, type }) => {
  const url = `/api/delete-entry-event/${id}`;

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

/**
 * Deletes a term event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string} termId - Term Id.
 * @param {number} weekNumber - Week for this term.
 * @returns {boolean} Success status.
 */
journalAPI.deleteTermEvent = async ({ id, eventId, termId, weekNumber }) => {
  const url = `/api/delete-term-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      eventId,
      termId,
      weekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Deletes a collection event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string} collectionId - Collection Id.
 * @returns {boolean} Success status.
 */
journalAPI.deleteCollectionEvent = async ({ id, eventId, collectionId }) => {
  const url = `/api/delete-collection-event/${id}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      eventId,
      collectionId,
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
 * @param {Date} entryDate - Date for journal entry this task belongs to.
 * @param {Date} migrateDate - Date for journal entry this task is being moved to.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} Migrated task.
 */
journalAPI.migrateEntryTask = async ({ id, taskId, entryDate, migrateDate, type }) => {
  const url = `/api/migrate-entry-task/${id}`;

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
 * Migrates a task.
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {Date} termId - Term Id
 * @param {Date} weekNumber - Current week number for this task.
 * @param {string} migrateWeekNumber - Week number to move this task to
 * @returns {object} Migrated task.
 */
journalAPI.migrateTermTask = async ({
  id,
  taskId,
  termId,
  weekNumber,
  migrateWeekNumber,
}) => {
  const url = `/api/migrate-term-task/${id}`;

  // id, taskId, content, entryDate, dueDate, migrateDate, type
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      taskId,
      termId,
      weekNumber,
      migrateWeekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Migrates a entry note.
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {Date} entryDate - Date for journal entry this task belongs to.
 * @param {Date} migrateDate - Date for journal entry this task is being moved to.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} Migrated task.
 */
journalAPI.migrateEntryNote = async ({ id, taskId, entryDate, migrateDate, type }) => {
  const url = `/api/migrate-entry-note/${id}`;

  // id, taskId, content, entryDate, dueDate, migrateDate, type
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      taskId,
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
 * Migrate a term note.
 * @param {string} id - User Id.
 * @param {string} taskId - Task Id.
 * @param {string} termId - Term Id.
 * @param {number} weekNumber - Current week number for this note.
 * @param {number} migrateWeekNumber - Week number to move this note to.
 * @returns {object} Migrated task.
 */
journalAPI.migrateTermNote = async ({
  id,
  taskId,
  termId,
  weekNumber,
  migrateWeekNumber,
}) => {
  const url = `/api/migrate-term-note/${id}`;

  // id, taskId, content, entryDate, dueDate, migrateDate, type
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      taskId,
      termId,
      weekNumber,
      migrateWeekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

/**
 * Migrates a entry event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {Date} entryDate - Date for journal entry this event belongs to.
 * @param {Date} migrateDate - Date for journal entry this event is being moved to.
 * @param {string} type - Type of journal entry: 'Daily', 'Weekly', 'Monthly'
 * @returns {object} Migrated event.
 */
journalAPI.migrateEntryEvent = async ({ id, eventId, entryDate, migrateDate, type }) => {
  const url = `/api/migrate-entry-event/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      eventId,
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
 * Migrates a term event.
 * @param {string} id - User Id.
 * @param {string} eventId - Event Id.
 * @param {string} termId - Date for journal entry this event belongs to.
 * @param {number} weekNumber - Current week number for this event.
 * @param {number} migrateWeekNumber - Week number that task is being moved to.
 * @returns {object} Migrated event.
 */
journalAPI.migrateTermEvent = async ({
  id,
  eventId,
  termId,
  weekNumber,
  migrateWeekNumber,
}) => {
  const url = `/api/migrate-term-event/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      eventId,
      termId,
      weekNumber,
      migrateWeekNumber,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
};

export default journalAPI;
