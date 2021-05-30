/* eslint-disable no-underscore-dangle */

/**
 * Journal Controller
 * @class
 */
export default class JournalController {
  // Set our passed in Journal model
  constructor(JournalModel) {
    this.Journal = JournalModel;
  }

  // Gets the type of entries to access based
  // on given type passed in
  static getEntryType(type) {
    switch (type) {
      case 'Daily':
        return 'dailyEntries';
      case 'Weekly':
        return 'weeklyEntries';
      case 'Semesterly':
        return 'semesterlyEntries';
      case 'Quarterly':
        return 'quarterlyEntries';
      default:
        return 'monthlyEntries';
    }
  }

  // Filters and return entries based on given to and from dates
  static filterEntries(entries, fromDate, toDate) {
    const _fromDate = new Date(fromDate);
    const _toDate = new Date(toDate);

    return entries.filter(
      (entry) =>
        entry.date.getTime() >= _fromDate.getTime() &&
        entry.date.getTime() <= _toDate.getTime()
    );
  }

  // Returns the entry which matches the given date
  static isCurrentDate(entry, entryDate) {
    const _entryDate = new Date(entryDate);

    return (
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear()
    );
  }

  // returns true if this is the item we're looking for
  static isItem(item, id) {
    return item._id.toString() === id;
  }

  /**
   * Creates a new Journal.
   * @param {string} id - User Id to create journal
   * @returns {object} New Journal
   */
  async createJournal(req, res) {
    const {
      params: { id },
    } = req;

    // Construct new journal object
    const newJournalObj = {
      _id: id,
      dailyEntries: [],
      termEntries: [],
      weeklyEntries: [],
      monthlyEntries: [],
    };

    let journal;
    try {
      // Get Journal model
      const { Journal } = this;

      // Create new Journal
      journal = new Journal(newJournalObj);

      // Add to database
      await journal.save();
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // successful
    return res.status(201).json({
      success: true,
      data: journal,
    });
  }

  /**
   * Gets journal in relation to the User
   * @param {string} id - User Id to retrieve their Journal
   * @returns {object} User Journal.
   */
  async getJournal(req, res) {
    // Get user id
    const {
      params: { id },
    } = req;

    // Attempt to retrieve journal for this user
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    return res.status(200).json({
      success: true,
      data: journal,
    });
  }

  /**
   * Get a journal entry.
   * @param {string} id - User Id to create journal
   * @param {string} date - Specific date for this journal entry
   * @param {string} type - Type of journal entry
   * @returns {object} Journal entry.
   */
  async getJournalEntry(req, res) {
    // Get date for this entry and user id
    const {
      params: { id, date, type },
    } = req;

    // Attempt to get journal for this user
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the entry
    const entry = journal[entryType].find((e) =>
      JournalController.isCurrentDate(e, date)
    );

    // If no entry exists for this given date, return success false
    if (!entry) {
      return res.status(400).json({
        success: false,
      });
    }

    // return entry
    return res.status(200).json({
      success: true,
      data: entry,
    });
  }

  /**
   * Gets journal entries.
   * @param {string} id - User Id
   * @param {string} fromDate - Starting date for journal entries
   * @param {string} toDate - End date for journal entries
   * @param {string} type - Type of entries to filter
   * @returns {[object]} All journal entries within this range (inclusive)
   */
  async getJournalEntries(req, res) {
    // Get user id, from date, to date, and type of entries to retrieve
    const {
      params: { id, fromDate, toDate, type },
    } = req;

    // Attempt to get this user journal
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the range of entries given the from and to dates
    const filteredEntries = JournalController.filterEntries(
      journal[entryType],
      fromDate,
      toDate
    );

    // return the filtered entries
    return res.status(200).json({
      success: true,
      data: filteredEntries,
    });
  }

  /**
   * Moves a task from one journal entry to another.
   * @param {object} moveTask - Information to create new journal entry
   * @returns {object} migrated task.
   */
  async migrateTask(req, res) {
    const {
      body: { taskId, content, entryDate, dueDate, migrateDate, type },
      params: { id },
    } = req;

    // Get the due date if applicable
    const _dueDate = dueDate ? new Date(dueDate) : null;

    // Construct new task object based on current entry task
    const moveTask = {
      content,
      dueDate: _dueDate,
    };

    // find current journal with user id
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the index for the entry which has the task we're trying to move
    const originEntryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Get the index for the task we're trying to move
    const taskIndex = journal[entryType][
      originEntryIndex
    ].tasks.findIndex((task) => JournalController.isItem(task, taskId));

    // Get the index of the entry which this task is being moved to
    const destEntryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, migrateDate)
    );

    // Add task
    journal[entryType][destEntryIndex].tasks.push(moveTask);

    // Remove task from old entry
    journal[entryType][originEntryIndex].tasks[taskIndex].remove();

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    // Return migrated task
    return res.status(200).json({
      success: true,
      data: moveTask,
    });
  }

  /**
   * Moves a note from one journal entry to another.
   * @param {object} moveNote - Information to create new journal entry
   * @returns {object} migrated note.
   */
  async migrateNote(req, res) {
    const {
      body: { noteId, content, type, entryDate, migrateDate },
      params: { id },
    } = req;

    // Construct notes
    const moveNote = {
      content,
    };

    // Initialize Journal
    let journal;

    // Attempt to find Journal() object with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);

    // Get the index for the entry which has the note we're trying to move
    const originEntryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );

    // Get the index for the note we're moving
    const noteIndex = journal[entryType][
      originEntryIndex
    ].notes.findIndex((note) => JournalController.isItem(note, noteId));

    // Get the index for the entry which this note is being moved to
    const destEntryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, migrateDate)
    );

    // Push note to new destination entry
    journal[entryType][destEntryIndex].notes.push(moveNote);
    // Remove note from old entry
    journal[entryType][originEntryIndex].notes[noteIndex].remove();

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    // Return migrated task
    return res.status(200).json({
      success: true,
      data: moveNote,
    });
  }

  /**
   * Moves an event from one journal entry to another.
   * @param {object} moveEvent - Information to create new journal entry
   * @returns {object} migrated event.
   */
  async migrateEvent(req, res) {
    const {
      body: {
        eventId,
        content,
        startTime,
        endTime,
        entryDate,
        migrateDate,
        link,
        type,
      },
      params: { id },
    } = req;

    // Get start and end times for this event
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Construct event object
    const moveEvent = {
      content,
      startTime: _startTime,
      endTime: _endTime,
      link,
    };

    // Initialize for journal()
    let journal;

    // Attempt to find current journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get index of the entry this event currently resides in
    const originEntryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Get index of the event we're going to move
    const eventIndex = journal[entryType][
      originEntryIndex
    ].events.findIndex((event) => JournalController.isItem(event, eventId));

    // Get index of the entry which were moving this event to
    const destEntryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, migrateDate)
    );

    // Add event to new future entry
    journal[entryType][destEntryIndex].events.push(moveEvent);
    // Remove event from old entry
    journal[entryType][originEntryIndex].events[eventIndex].remove();

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    // Return migrated task
    return res.status(200).json({
      success: true,
      data: moveEvent,
    });
  }

  /**
   * Adds a new journal entry.
   * @param {string} id - User Id
   * @param {Date} date - Date for this entry
   * @param {string} type - Type of entry
   * @returns {object} New Entry
   */
  async addJournalEntry(req, res) {
    // Get passed in data, and user id for finding journal
    const {
      body: { type, date },
      params: { id },
    } = req;

    // Get new date for this entry
    const _date = new Date(date);

    // Construct new journal entry object
    const newEntry = {
      tasks: [],
      notes: [],
      events: [],
      date: _date,
    };

    // Initialize journal to hold a Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);

    // Add new entry
    journal[entryType].push(newEntry);

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    // Return new entry
    return res.status(201).json({
      success: true,
      data: newEntry,
    });
  }

  /**
   * Adds a new task.
   * @param {string} id - User Id.
   * @param {string} content - Task content.
   * @param {Date} dueDate - Due date for task.
   * @param {Date} entry - Date for this journal entry.
   * @param {string} type - Type of journal entry.
   * @returns {object} New task.
   */
  async addTask(req, res) {
    // Get passed in data, and user id for finding journal
    const {
      body: { content, entryDate, dueDate, type },
      params: { id },
    } = req;

    // Get the due date if applicable
    const _dueDate = dueDate ? new Date(dueDate) : null;

    // Construct new task object
    const newTask = {
      content,
      dueDate: _dueDate,
    };

    // Attempt to find journal with user id
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }
    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the index for the entry to add this task to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Add new task
    journal[entryType][entryIndex].tasks.push(newTask);

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    // Return new task
    return res.status(201).json({
      success: true,
      data: newTask,
    });
  }

  /**
   * Updates a task.
   * @param {string} id - User Id.
   * @param {string} content - Updated content for task.
   * @param {Date} dueDate - Due date for task.
   * @param {Date} entryDate - Date for journal entry this event belongs to.
   * @param {string} type - Type of journal entry.
   * @returns {object} Updated event.
   */
  async updateTask(req, res) {
    // Get passed in data, and user id for finding journal
    const {
      body: { taskId, content, entryDate, dueDate, type },
      params: { id },
    } = req;

    // Get due date if applicable
    const _dueDate = dueDate ? new Date(dueDate) : null;

    // // Construct updated task object
    const updatedTask = {
      content,
      dueDate: _dueDate,
    };

    // Initialize for Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get index of entry this task belongs to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Get index of task to update
    const taskIndex = journal[entryType][entryIndex].tasks.findIndex((entry) =>
      JournalController.isItem(entry, taskId)
    );

    // Set new updated task
    journal[entryType][entryIndex].tasks[taskIndex] = updatedTask;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    // Return new task
    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  }

  /**
   * Deletes a task.
   * @param {string} id - Id for this journal.
   * @param {string} taskId - Id for this task.
   * @param {Date} type - Date for this journal entry.
   * @param {string} type - Type of journal entry this task is related to.
   */
  async deleteTask(req, res) {
    // Get passed in data, and user id for finding journal
    const {
      body: { taskId, entryDate, type },
      params: { id },
    } = req;

    // Initialize for Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the index for the entry this task belongs to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Get the index of the task to delete
    const taskIndex = journal[entryType][entryIndex].tasks.findIndex((task) =>
      JournalController.isItem(task, taskId)
    );

    // Delete task
    await journal[entryType][entryIndex].tasks[taskIndex].remove();

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    return res.status(200).json({
      success: true,
    });
  }

  /**
   * Adds a new note.
   * @param {string} id - User Id
   * @param {string} content - Note content
   * @param {Date} entryDate - Date for journal entry
   * @param {string} type - Type of journal entry
   * @returns {object} New note.
   */
  async addNote(req, res) {
    // Get passed in data and user id for finding journal
    const {
      body: { content, entryDate, type },
      params: { id },
    } = req;

    const _entryDate = new Date(entryDate);

    // Construct new note object
    const newNote = {
      content,
    };

    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get index of the entry which this note belongs to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, _entryDate)
    );
    // Add new note
    journal[entryType][entryIndex].notes.push(newNote);

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    // Return new note
    return res.status(201).json({
      success: true,
      newNote,
    });
  }

  /**
   * Updates a note.
   * @param {string} id - User Id
   * @param {string} noteId - Id for this note
   * @param {string} content - Updated text for this Note
   * @param {Date} entryDate - Date for journal entry this note belongs to
   * @param {string} type - Type of journal entry
   * @returns {object} Updated note
   */
  async updateNote(req, res) {
    // get passed in data and user id for finding journal
    const {
      body: { noteId, content, entryDate, type },
      params: { id },
    } = req;

    // Construct updated note object
    const updatedNote = {
      content,
    };

    // Initialize journal
    let journal;

    // Attempt to find Journal() object with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the index of the entry which this note belongs to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Get the index of the note we need to update
    const noteIndex = journal[entryType][entryIndex].notes.findIndex((note) =>
      JournalController.isItem(note, noteId)
    );
    // Update note
    journal[entryType][entryIndex].notes[noteIndex] = updatedNote;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Return updated note
    return res.status(200).json({
      success: true,
      data: updatedNote,
    });
  }

  /**
   * Deletes a note.
   * @param {string} id - Id for this user.
   * @param {string} noteId - Id for this note.
   * @param {Date} type - Date for this journal entry
   * @param {string} type - Type of journal entry this task is related to.
   */
  async deleteNote(req, res) {
    // get passed in data and user id for finding journal
    const {
      body: { noteId, entryDate, type },
      params: { id },
    } = req;

    // Initialize journal
    let journal;

    // Attempt to find Journal() object with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the index of the entry which this note belongs to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Get the index of the note to delete
    const noteIndex = journal[entryType][entryIndex].notes.findIndex((note) =>
      JournalController.isItem(note, noteId)
    );

    // Delete note
    journal[entryType][entryIndex].notes[noteIndex].remove();

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    return res.status(200).json({
      success: true,
    });
  }

  /**
   * Adds a new event.
   * @param {string} id - User Id
   * @param {string} content - Event content
   * @param {string} content - URL link
   * @param {Date} entryDate - Date for journal entry
   * @param {string} type - Type of journal entry
   * @returns {object} New event.
   */
  async addEvent(req, res) {
    // Get passed in data and user id for finding journal
    const {
      body: { content, startTime, endTime, entryDate, link, type },
      params: { id },
    } = req;

    // Get start and end time for this new event
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Construct new event object
    const newEvent = {
      content,
      startTime: _startTime,
      endTime: _endTime,
      link,
    };

    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the index of the entry which this event belongs to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );

    // Add new event
    journal[entryType][entryIndex].events.push(newEvent);

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Return new note
    return res.status(201).json({
      success: true,
      data: newEvent,
    });
  }

  /**
   * Updates an event.
   * @param {string} id - User Id
   * @param {string} content - Updated content for event
   * @param {string} link - URL link for this event
   * @param {Date} entryDate - Date for journal entry this event belongs to
   * @param {string} type - Type of journal entry
   * @returns {object} Updated event
   */
  async updateEvent(req, res) {
    // Get passed in data and user id for finding journal
    const {
      body: { eventId, content, startTime, endTime, entryDate, link, type },
      params: { id },
    } = req;

    // Get the start and end times
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Construct new event object
    const updatedEvent = {
      content,
      startTime: _startTime,
      endTime: _endTime,
      link,
    };

    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the index of the entry which this event belongs to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Get the index of the event to update
    const eventIndex = journal[entryType][
      entryIndex
    ].events.findIndex((event) => JournalController.isItem(event, eventId));

    // Update event
    journal[entryType][entryIndex].events[eventIndex] = updatedEvent;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Return new note
    return res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  }

  /**
   * Deletes an event.
   * @param {string} id - Id for this user.
   * @param {string} eventId - Id for this event.
   * @param {Date} entryDate - Date for this journal entry
   * @param {string} type - Type of journal entry this event is related to.
   */
  async deleteEvent(req, res) {
    // Get passed in data and user id for finding journal
    const {
      body: { eventId, entryDate, type },
      params: { id },
    } = req;

    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const entryType = JournalController.getEntryType(type);
    // Get the index of the entry which this event belongs to
    const entryIndex = journal[entryType].findIndex((entry) =>
      JournalController.isCurrentDate(entry, entryDate)
    );
    // Get the index of the event to delete
    const eventIndex = journal[entryType][
      entryIndex
    ].events.findIndex((event) => JournalController.isItem(event, eventId));

    // Remove event
    journal[entryType][entryIndex].events[eventIndex].remove();

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    return res.status(200).json({ success: true });
  }
}
