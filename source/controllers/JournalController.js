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

  // Gets the name of the journal property
  // we want to access on given type passed in
  static getPropertyName(type) {
    switch (type) {
      case 'Daily':
        return 'dailyEntries';
      case 'Weekly':
        return 'weeklyEntries';
      case 'Semesterly':
        return 'semesterlyEntries';
      case 'Quarterly':
        return 'quarterlyEntries';
      case 'Monthly':
        return 'monthlyEntries';
      default:
        return 'collections';
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
  static isItem({ item, id = null, entryDate = null }) {
    // If given a date
    if (entryDate) {
      return this.isCurrentDate(item, entryDate);
    }
    // Else given an id
    return item._id.toString() === id;
  }

  /**
   * Creates a new Journal.
   * @param {string} id - User Id.
   * @returns {object} New Journal.
   */
  async createJournal({ params: { id } }, res) {
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
   * @param {string} id - User Id.
   * @returns {object} User Journal.
   */
  async getJournal({ params: { id } }, res) {
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
   * @param {string} id - User Id to create journal.
   * @param {string} date - Specific date for this journal entry.
   * @param {string} type - Type of journal entry.
   * @returns {object} Journal entry.
   */
  async getJournalEntry({ params: { id, date, type } }, res) {
    // Attempt to get journal for this user
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the type of entries we're accessing
    const propertyName = JournalController.getPropertyName(type);

    // Get the entry
    const entry = journal[propertyName].find((e) =>
      JournalController.isItem({ item: e, entryDate: date })
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
   * @param {string} id - User Id.
   * @param {string} fromDate - Starting date for journal entries.
   * @param {string} toDate - End date for journal entries.
   * @param {string} type - Type of entries to filter.
   * @returns {[object]} All journal entries within this range (inclusive).
   */
  async getJournalEntries(
    { params: { id, fromDate, toDate, type } },
    res
  ) {
    // Attempt to get this user journal
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the range of entries given the from and to dates
    const filteredEntries = JournalController.filterEntries(
      journal[propertyName],
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
   * Get a journal collection.
   * @param {string} id - User Id.
   * @param {string} collectionId - Collection Id.
   * @returns {object} Journal Collection.
   */
  async getJournalCollection({ params: { id, collectionId } }, res) {
    // Attempt to get journal for this user
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the collection
    const collection = journal.collections.find((c) =>
      JournalController.isItem({ item: c, id: collectionId })
    );

    // If no entry exists for this given date, return success false
    if (!collection) {
      return res.status(400).json({
        success: false,
      });
    }

    // return entry
    return res.status(200).json({
      success: true,
      data: collection,
    });
  }

  /**
   * Adds a new journal entry.
   * @param {string} id - User Id.
   * @param {Date} date - Date for this entry.
   * @param {string} type - Type of entry.
   * @returns {object} New Entry.
   */
  async addJournalEntry(
    { body: { type, date }, params: { id } },
    res
  ) {
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
    const propertyName = JournalController.getPropertyName(type);

    // Add new entry
    journal[propertyName].push(newEntry);

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
   * Adds a new journal collection.
   * @param {string} id - User Id.
   * @param {string} name - Name for this collection.
   * @returns {object} New Journal Collection.
   */
  async addJournalCollection(
    { body: { name }, params: { id } },
    res
  ) {
    // Construct new collection object
    const newCollection = {
      name,
      tasks: [],
      notes: [],
      events: [],
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

    // Add new collection to journal
    journal.collections.push(newCollection);

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
      data: newCollection,
    });
  }

  /**
   * Adds a new task.
   * @param {string} id - User Id.
   * @param {string} content - Task content.
   * @param {Date} dueDate - Due date for task.
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Name for journal property to.
   * @returns {object} New task.
   */
  async addTask(
    {
      body: {
        content,
        dueDate = null,
        collectionId = null,
        entryDate = null,
        type,
      },
      params: { id },
    },
    res
  ) {
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

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Add new task
    journal[propertyName][propertyIndex].tasks.push(newTask);

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
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for journal entry this task belongs to.
   * @param {string} type - Name for journal property to.
   * @returns {object} Updated task.
   */
  async updateTask(
    {
      body: {
        taskId,
        content,
        collectionId = null,
        entryDate = null,
        dueDate = null,
        type,
      },
      params: { id },
    },
    res
  ) {
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

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Get index of task to update
    const taskIndex = journal[propertyName][
      propertyIndex
    ].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Set new updated task
    journal[propertyName][propertyIndex].tasks[
      taskIndex
    ] = updatedTask;

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
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Name for journal property to this task is related to.
   */
  async deleteTask(
    {
      body: { taskId, collectionId = null, entryDate = null, type },
      params: { id },
    },
    res
  ) {
    // Initialize for Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Get the index of the task to delete
    const taskIndex = journal[propertyName][
      propertyIndex
    ].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Delete task
    await journal[propertyName][propertyIndex].tasks[
      taskIndex
    ].remove();

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
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for journal entry
   * @param {string} type - Name for journal property to
   * @returns {object} New note.
   */
  async addNote(
    {
      body: { content, collectionId, entryDate, type },
      params: { id },
    },
    res
  ) {
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

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Add new note
    journal[propertyName][propertyIndex].notes.push(newNote);

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
   * @param {string} id - User Id.
   * @param {string} noteId - Note Id.
   * @param {string} content - Updated text for this Note
   * @param {string} collectionId - Collection Id
   * @param {Date} entryDate - Date for journal entry this note belongs to
   * @param {string} type - Name for journal property to
   * @returns {object} Updated note
   */
  async updateNote(
    {
      body: {
        noteId,
        content,
        collectionId = null,
        entryDate = null,
        type,
      },
      params: { id },
    },
    res
  ) {
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

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Get the index of the note we need to update
    const noteIndex = journal[propertyName][
      propertyIndex
    ].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Update note
    journal[propertyName][propertyIndex].notes[
      noteIndex
    ] = updatedNote;

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
   * @param {string} collectionId - Collection Id
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Name for journal property to this task is related to.
   */
  async deleteNote(req, res) {
    // get passed in data and user id for finding journal
    const {
      body: { noteId, collectionId = null, entryDate = null, type },
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

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Get the index of the note to delete
    const noteIndex = journal[propertyName][
      propertyIndex
    ].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Delete note
    journal[propertyName][propertyIndex].notes[noteIndex].remove();

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
   * @param {string} content - Event content.
   * @param {string} link - URL link.
   * @param {Date} startTime - Start time for event.
   * @param {Date} endTime - End time for event.
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for journal entry.
   * @param {string} type - Type for property name,
   * @returns {object} New event.
   */
  async addEvent(
    {
      body: {
        content,
        link,
        startTime,
        endTime,
        collectionId = null,
        entryDate = null,
        type,
      },
      params: { id },
    },
    res
  ) {
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

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Add new event
    journal[propertyName][propertyIndex].events.push(newEvent);

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
   * @param {string} id - User Id.
   * @param {string} eventId - Event Id.
   * @param {string} content - Updated content for event.
   * @param {string} link - URL link for this event.
   * @param {Date} startTime - Start time for this event.
   * @param {Date} endTime - End time for this event.
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for journal entry this event belongs to.
   * @param {string} type - Name for journal property to
   * @returns {object} Updated event
   */
  async updateEvent(
    {
      body: {
        eventId,
        content,
        link,
        startTime,
        endTime,
        collectionId = null,
        entryDate = null,
        type,
      },
      params: { id },
    },
    res
  ) {
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

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Get the index of the event to update
    const eventIndex = journal[propertyName][
      propertyIndex
    ].events.findIndex((event) =>
      JournalController.isItem({ item: event, id: eventId })
    );

    // Update event
    journal[propertyName][propertyIndex].events[
      eventIndex
    ] = updatedEvent;

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
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Name for journal property to this event is related to.
   */
  async deleteEvent(
    {
      body: { eventId, collectionId = null, entryDate = null, type },
      params: { id },
    },
    res
  ) {
    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the journal property which this note belongs to
    const propertyIndex = journal[propertyName].findIndex((item) =>
      JournalController.isItem({ item, id: collectionId, entryDate })
    );

    // Get the index of the event to delete
    const eventIndex = journal[propertyName][
      propertyIndex
    ].events.findIndex((event) =>
      JournalController.isItem({ item: event, id: eventId })
    );

    // Remove event
    journal[propertyName][propertyIndex].events[eventIndex].remove();

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    return res.status(200).json({ success: true });
  }

  /**
   * Moves a task from one journal entry to another.
   * @param {object} moveTask - Information to create new journal entry
   * @returns {object} migrated task.
   */
  async migrateTask(
    {
      body: {
        taskId,
        content,
        entryDate,
        dueDate,
        migrateDate,
        type,
      },
      params: { id },
    },
    res
  ) {
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
    const propertyName = JournalController.getPropertyName(type);

    // Get the index for the entry which has the task we're trying to move
    const originPropertyIndex = journal[
      propertyName
    ].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get the index for the task we're trying to move
    const taskIndex = journal[propertyName][
      originPropertyIndex
    ].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Get the index of the entry which this task is being moved to
    const destPropertyIndex = journal[propertyName].findIndex(
      (entry) =>
        JournalController.isItem({
          item: entry,
          entryDate: migrateDate,
        })
    );

    // Add task
    journal[propertyName][destPropertyIndex].tasks.push(moveTask);

    // Remove task from old entry
    journal[propertyName][originPropertyIndex].tasks[
      taskIndex
    ].remove();

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
  async migrateNote(
    {
      body: { noteId, content, type, entryDate, migrateDate },
      params: { id },
    },
    res
  ) {
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
    const propertyName = JournalController.getPropertyName(type);

    // Get the index for the entry which has the note we're trying to move
    const originPropertyIndex = journal[
      propertyName
    ].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get the index for the note we're moving
    const noteIndex = journal[propertyName][
      originPropertyIndex
    ].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Get the index for the entry which this note is being moved to
    const destPropertyIndex = journal[propertyName].findIndex(
      (entry) =>
        JournalController.isItem({
          item: entry,
          entryDate: migrateDate,
        })
    );

    // Push note to new destination entry
    journal[propertyName][destPropertyIndex].notes.push(moveNote);

    // Remove note from old entry
    journal[propertyName][originPropertyIndex].notes[
      noteIndex
    ].remove();

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
  async migrateEvent(
    {
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
    },
    res
  ) {
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
    const propertyName = JournalController.getPropertyName(type);

    // Get index of the entry this event currently resides in
    const originPropertyIndex = journal[
      propertyName
    ].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get index of the event we're going to move
    const eventIndex = journal[propertyName][
      originPropertyIndex
    ].events.findIndex((event) =>
      JournalController.isItem({ item: event, id: eventId })
    );

    // Get index of the entry which were moving this event to
    const destPropertyIndex = journal[propertyName].findIndex(
      (entry) =>
        JournalController.isItem({
          item: entry,
          entryDate: migrateDate,
        })
    );

    // Add event to new future entry
    journal[propertyName][destPropertyIndex].events.push(moveEvent);

    // Remove event from old entry
    journal[propertyName][originPropertyIndex].events[
      eventIndex
    ].remove();

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
}
