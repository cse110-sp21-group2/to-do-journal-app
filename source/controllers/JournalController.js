/* eslint-disable no-underscore-dangle */
/* eslint no-param-reassign: "error" */
import mongoose from 'mongoose';

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

  static isCurrentTerm(term, date) {
    const _date = new Date(date);

    return (
      term.startDate.getTime() <= _date.getTime() &&
      term.endDate.getTime() >= _date.getTime()
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

  // Initializes a new term based on type,
  // i.e. 'Semester' or 'Quarter', and start date
  static initializeTerm(type, _date) {
    const termId = mongoose.Types.ObjectId();
    const term = {};

    const date = new Date(_date);

    term._id = termId;
    term.weeks = [];

    const week = {
      tasks: [],
      notes: [],
      events: [],
    };

    const max = type === 'Quarter' ? 11 : 16;

    for (let i = 0; i < max; i += 1) {
      const startDate = new Date(date.getTime() + 7 * i * 86400000);
      const endDate = new Date(startDate.getTime() + 7 * 86400000);

      const weekId = mongoose.Types.ObjectId();

      week._id = weekId;
      week.startDate = startDate;
      week.endDate = endDate;

      term.weeks.push(week);
    }

    return term;
  }

  /**
   * Creates a new Journal.
   * @param {string} id - User Id.
   * @returns {Object} New Journal.
   */
  async createJournal({ params: { id } }, res) {
    // Construct new journal object
    const newJournalObj = {
      _id: id,
      dailyEntries: [],
      weeklyEntries: [],
      monthlyEntries: [],
      terms: [],
      collections: [],
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
   * @returns {Object} User Journal.
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
   * @returns {Object} Journal entry.
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
   * @returns {Object} All journal entries within this range (inclusive).
   */
  async getJournalEntries({ params: { id, fromDate, toDate, type } }, res) {
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
   * @returns {Object} Journal Collection.
   */
  async getJournalCollection({ params: { id, collectionName } }, res) {
    // Attempt to get journal for this user
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the collection
    const collection = journal.collections.find((c) => c.name === collectionName);

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
   * Get a journal term.
   * @param {string} id - User Id.
   * @param {string} termId - Term Id.
   * @returns {Object} Journal Term.
   */
  async getJournalTerm({ params: { id, date } }, res) {
    // Attempt to get journal for this user
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the collection
    const term = journal.terms.find((t) => JournalController.isCurrentTerm(t, date));

    // If no entry exists for this given date, return success false
    if (!term) {
      return res.status(400).json({
        success: false,
      });
    }

    // return entry
    return res.status(200).json({
      success: true,
      data: term,
    });
  }

  /**
   * Adds a new journal entry.
   * @param {string} id - User Id.
   * @param {Date} date - Date for this entry.
   * @param {string} type - Type of entry.
   * @returns {Object} New Entry.
   */
  async addJournalEntry({ body: { type, date }, params: { id } }, res) {
    const newEntryId = mongoose.Types.ObjectId();

    // Get new date for this entry
    const _date = new Date(date);

    // Construct new journal entry object
    const newEntry = {
      _id: newEntryId,
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
   * @returns {Object} New Journal Collection.
   */
  async addJournalCollection({ body: { name }, params: { id } }, res) {
    const newCollectionId = mongoose.Types.ObjectId();

    // Construct new collection object
    const newCollection = {
      _id: newCollectionId,
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
   * Adds a new journal term.
   * @param {string} id - User Id.
   * @param {string} type - Type of academic term, i.e. quarter / semester.
   * @param {Date} startDate - Start date for this term
   * @param {Date} endDate - End date for this term
   * @returns {object} New Journal Term.
   */
  async addJournalTerm({ body: { type, startDate, endDate }, params: { id } }, res) {
    // Construct new collection object
    const newTerm = JournalController.initializeTerm(type, startDate);

    newTerm.startDate = new Date(startDate);
    newTerm.endDate = new Date(endDate);

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
    journal.terms.push(newTerm);

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
      data: newTerm,
    });
  }

  /**
   * Adds a entry task.
   * @param {string} id - User Id.
   * @param {string} content - Task content.
   * @param {Date} dueDate - Due date for task.
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly.
   * @returns {Object} New task.
   */
  async addEntryTask(
    { body: { content, dueDate = null, entryDate, type }, params: { id } },
    res
  ) {
    const taskId = mongoose.Types.ObjectId();

    // Get the due date if applicable
    const _dueDate = dueDate ? new Date(dueDate) : null;

    // Construct new task object
    const newTask = {
      _id: taskId,
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
    // Get type of entries to access
    const propertyName = JournalController.getPropertyName(type);

    // Get index of entry
    const propertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
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
   * Adds a term task.
   * @param {string} id - User Id.
   * @param {string} content - Task content.
   * @param {Date} dueDate - Due date for task.
   * @param {string} termId - Term Id.
   * @param {Date} weekNumber - Week number in term.
   * @returns {Object} New task.
   */
  async addTermTask(
    { body: { content, dueDate = null, termId, weekNumber }, params: { id } },
    res
  ) {
    const newTaskId = mongoose.Types.ObjectId();

    // Get the due date if applicable
    const _dueDate = dueDate ? new Date(dueDate) : null;

    // Construct new task object
    const newTask = {
      _id: newTaskId,
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

    // Get index of term
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Using termIndex and weekNumber, add new task
    journal.terms[termIndex].weeks[weekNumber].tasks.push(newTask);

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
   * Updates an entry task.
   * @param {string} id - User Id.
   * @param {string} content - Updated content for task.
   * @param {Date} dueDate - Due date for task.
   * @param {Date} entryDate - Date for journal entry this task belongs to.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly.
   * @returns {Object} Updated task.
   */
  async updateEntryTask(
    { body: { taskId, content, dueDate = null, entryDate, type }, params: { id } },
    res
  ) {
    // Get due date if applicable
    const _dueDate = dueDate ? new Date(dueDate) : null;

    // Initialize for Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get type of entries to access
    const propertyName = JournalController.getPropertyName(type);

    // Get index of entry we need by date
    const entryIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get index of task to update by id
    const taskIndex = journal[propertyName][entryIndex].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Update task
    journal[propertyName][entryIndex].tasks[taskIndex].content = content;
    journal[propertyName][entryIndex].tasks[taskIndex].dueDate = _dueDate;

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

    // Get updated task
    const updatedTask = journal[propertyName][entryIndex].tasks[taskIndex];

    // Return updated task
    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  }

  /**
   * Updates a term task.
   * @param {string} id - User Id.
   * @param {string} content - Updated content for task.
   * @param {Date} dueDate - Due date for task.
   * @param {string} termId - Term Id.
   * @param {number} weekNumber - Week number for this term.
   * @returns {Object} Updated task.
   */
  async updateTermTask(
    { body: { taskId, content, dueDate = null, termId, weekNumber }, params: { id } },
    res
  ) {
    // Get due date if applicable
    const _dueDate = dueDate ? new Date(dueDate) : null;

    // Initialize for Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get index of term we need by id
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Get index of task to update by id
    const taskIndex = journal.terms[termIndex].weeks[weekNumber].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Update task
    journal.terms[termIndex].weeks[weekNumber].tasks[taskIndex].content = content;
    journal.terms[termIndex].weeks[weekNumber].tasks[taskIndex].dueDate = _dueDate;

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

    // Get updated task
    const updatedTask = journal.terms[termIndex].weeks[weekNumber].tasks[taskIndex];

    // Return new task
    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  }

  /**
   * Deletes an entry task.
   * @param {string} id - Id for this journal.
   * @param {string} taskId - Id for this task.
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly.
   * @returns {boolean} Success status.
   */
  async deleteEntryTask({ body: { taskId, entryDate, type }, params: { id } }, res) {
    // Initialize for Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the name of the entries we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index of the entry
    const propertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get index of task to delete
    const taskIndex = journal[propertyName][propertyIndex].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Delete task
    await journal[propertyName][propertyIndex].tasks[taskIndex].remove();

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
   * Deletes a term task.
   * @param {string} id - Id for this journal.
   * @param {string} taskId - Id for this task.
   * @param {string} termId - Term Id.
   * @param {number} entryDate - Week number for this term.
   * @returns {boolean} Success status.
   */
  async deleteTermTask({ body: { taskId, termId, weekNumber }, params: { id } }, res) {
    // Initialize for Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get index of term to access
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Get task index to delete
    const taskIndex = journal.terms[termIndex].weeks[weekNumber].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Delete task
    await journal.terms[termIndex].weeks[weekNumber].tasks[taskIndex].remove();

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
   * Adds a entry note.
   * @param {string} id - User Id.
   * @param {string} content - Note content.
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly.
   * @returns {Object} New note.
   */
  async addEntryNote({ body: { content, entryDate, type }, params: { id } }, res) {
    const noteId = mongoose.Types.ObjectId();

    // Construct new note object
    const newNote = {
      _id: noteId,
      content,
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

    // Get type of entries to access
    const propertyName = JournalController.getPropertyName(type);

    // Get index of entry we need by date
    const propertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Add note
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

    // Return new task
    return res.status(201).json({
      success: true,
      data: newNote,
    });
  }

  /**
   * Adds a term note.
   * @param {string} id - User Id.
   * @param {string} content - Note content.
   * @param {string} termId - Term Id.
   * @param {Date} weekNumber - Week number in term.
   * @returns {Object} New Note.
   */
  async addTermNote({ body: { content, termId, weekNumber }, params: { id } }, res) {
    const noteId = mongoose.Types.ObjectId();

    // Construct new note object
    const newNote = {
      _id: noteId,
      content,
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
    // Get index of term to access
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Using termIndex and weekNumber, add note
    journal.terms[termIndex].weeks[weekNumber].notes.push(newNote);

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
      data: newNote,
    });
  }

  /**
   * Adds a collection note.
   * @param {string} id - User Id.
   * @param {string} content - Note content.
   * @param {string} collectionId - Collection Id.
   * @returns {Object} New note.
   */
  async addCollectionNote({ body: { content, collectionId }, params: { id } }, res) {
    const noteId = mongoose.Types.ObjectId();

    // Construct new task object
    const newNote = {
      _id: noteId,
      content,
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

    // Get index of collection to access
    const collectionIndex = journal.collections.findIndex((collection) =>
      JournalController.isItem({ item: collection, id: collectionId })
    );

    // Add note
    journal.collections[collectionIndex].notes.push(newNote);

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
      data: newNote,
    });
  }

  /**
   * Updates a entry note.
   * @param {string} id - User Id.
   * @param {string} noteId - Note Id.
   * @param {string} content - Updated text for this Note
   * @param {string} collectionId - Collection Id
   * @param {Date} entryDate - Date for journal entry this note belongs to
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly
   * @returns {Object} Updated note
   */
  async updateEntryNote(
    { body: { noteId, content, entryDate, type }, params: { id } },
    res
  ) {
    // Initialize journal
    let journal;

    // Attempt to find Journal() object with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    const propertyName = JournalController.getPropertyName(type);
    // Get the index of the item to delete

    // Get index of entry we need by date
    const entryIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get index of task to update by id
    const noteIndex = journal[propertyName][entryIndex].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Update note
    journal[propertyName][entryIndex].notes[noteIndex].content = content;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get updated note
    const updatedNote = journal[propertyName][entryIndex].notes[noteIndex];

    // Return updated note
    return res.status(200).json({
      success: true,
      data: updatedNote,
    });
  }

  /**
   * Updates a term note.
   * @param {string} id - User Id.
   * @param {string} noteId - Note Id.
   * @param {string} content - Updated text for this Note
   * @param {string} termId - Term Id
   * @param {number} weekNumber - Week number in this term.
   * @returns {Object} Updated note
   */
  async updateTermNote(
    { body: { noteId, content, termId, weekNumber }, params: { id } },
    res
  ) {
    // Initialize journal
    let journal;

    // Attempt to find Journal() object with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get index of entry we need by date
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Get index of task to update by id
    const noteIndex = journal.terms[termIndex].weeks[weekNumber].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Update note
    journal.terms[termIndex].weeks[weekNumber].notes[noteIndex].content = content;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get updated note
    const updatedNote = journal.terms[termIndex].weeks[weekNumber].notes[noteIndex];

    // Return updated note
    return res.status(200).json({
      success: true,
      data: updatedNote,
    });
  }

  /**
   * Updates a collection note.
   * @param {string} id - User Id.
   * @param {string} noteId - Note Id.
   * @param {string} content - Updated text for this Note
   * @param {string} collectionId - Collection Id
   * @returns {Object} Updated note
   */
  async updateCollectionNote(
    { body: { noteId, content, collectionId }, params: { id } },
    res
  ) {
    // Initialize journal
    let journal;

    // Attempt to find Journal() object with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get index of entry we need by date
    const collectionIndex = journal.collections.findIndex((collection) =>
      JournalController.isItem({ item: collection, id: collectionId })
    );

    // Get index of task to update by id
    const noteIndex = journal.collections[collectionIndex].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Update note
    journal.collections[collectionIndex].notes[noteIndex].content = content;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get updated note
    const updatedNote = journal.collections[collectionIndex].notes[noteIndex];

    // Return updated note
    return res.status(200).json({
      success: true,
      data: updatedNote,
    });
  }

  /**
   * Deletes an entry note.
   * @param {string} id - Id for this user.
   * @param {string} noteId - Id for this note.
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly.
   * @returns {boolean} Success status.
   */
  async deleteEntryNote(req, res) {
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

    // Get the name of the journal property we want to access
    const propertyName = JournalController.getPropertyName(type);

    // Get the index for this entry
    const propertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get index of note to delete
    const noteIndex = journal[propertyName][propertyIndex].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Delete note
    await journal[propertyName][propertyIndex].notes[noteIndex].remove();

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
   * Deletes a term note.
   * @param {string} id - Id for this user.
   * @param {string} noteId - Id for this note.
   * @param {string} termId - Collection Id.
   * @param {number} weekNumber - Week number in this term.
   * @returns {boolean} Success status.
   */
  async deleteTermNote(req, res) {
    // get passed in data and user id for finding journal
    const {
      body: { noteId, termId, weekNumber },
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

    // Get index of term to access
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Get index of note to delete
    const noteIndex = journal.terms[termIndex].weeks[weekNumber].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Delete note
    await journal.terms[termIndex].weeks[weekNumber].notes[noteIndex].remove();

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
   * Deletes a collection note.
   * @param {string} id - Id for this user.
   * @param {string} noteId - Id for this note.
   * @param {string} collectionId - Collection Id.
   * @returns {boolean} Success status.
   */
  async deleteCollectionNote(req, res) {
    // get passed in data and user id for finding journal
    const {
      body: { noteId, collectionId },
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

    // Get index of collection to access
    const collectionIndex = journal.collections.findIndex((collection) =>
      JournalController.isItem({ item: collection, id: collectionId })
    );

    // Get index of note to delete
    const noteIndex = journal.collections[collectionIndex].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Delete note
    await journal.collections[collectionIndex].notes[noteIndex].remove();

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
   * Adds a new entry event.
   * @param {string} id - User Id
   * @param {string} content - Event content.
   * @param {string} URL - URL.
   * @param {Date} startTime - Start time for event.
   * @param {Date} endTime - End time for event.
   * @param {Date} entryDate - Date for journal entry.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly.
   * @returns {Object} New event.
   */
  async addEntryEvent(
    {
      body: { content, URL = null, startTime, endTime, entryDate, type },
      params: { id },
    },
    res
  ) {
    const eventId = mongoose.Types.ObjectId();

    // Get start and end time for this new event
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Construct new event object
    const newEvent = {
      _id: eventId,
      content,
      startTime: _startTime,
      endTime: _endTime,
      URL,
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

    // Get type of entries to access
    const propertyName = JournalController.getPropertyName(type);

    // Get index for this entry
    const propertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Add event
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
   * Adds a new term event.
   * @param {string} id - User Id
   * @param {string} content - Event content.
   * @param {string} URL - URL.
   * @param {Date} startTime - Start time for event.
   * @param {Date} endTime - End time for event.
   * @param {string} termId - Term Id.
   * @param {number} weekNumber - Week number for current term,
   * @returns {Object} New event.
   */
  async addTermEvent(
    { body: { content, URL, startTime, endTime, termId, weekNumber }, params: { id } },
    res
  ) {
    const eventId = mongoose.Types.ObjectId();

    // Get start and end time for this new event
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Construct new event object
    const newEvent = {
      _id: eventId,
      content,
      startTime: _startTime,
      endTime: _endTime,
      URL,
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

    // Get index of term
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Using termIndex and weekNumber, add event
    journal.terms[termIndex].weeks[weekNumber].events.push(newEvent);

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
   * Adds a new collection event.
   * @param {string} id - User Id
   * @param {string} content - Event content.
   * @param {string} URL - URL.
   * @param {Date} startTime - Start time for event.
   * @param {Date} endTime - End time for event.
   * @param {string} collectionId - Collection Id.
   * @returns {Object} New event.
   */
  async addCollectionEvent(
    { body: { content, URL, startTime, endTime, collectionId }, params: { id } },
    res
  ) {
    const eventId = mongoose.Types.ObjectId();

    // Get start and end time for this new event
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Construct new event object
    const newEvent = {
      _id: eventId,
      content,
      startTime: _startTime,
      endTime: _endTime,
      URL,
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

    // Get index of collection to access
    const collectionIndex = journal.collections.findIndex((collection) =>
      JournalController.isItem({ item: collection, id: collectionId })
    );

    // Add event
    journal.collections[collectionIndex].events.push(newEvent);

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
   * @param {string} URL - URL for this event.
   * @param {Date} startTime - Start time for this event.
   * @param {Date} endTime - End time for this event.
   * @param {string} collectionId - Collection Id.
   * @param {Date} entryDate - Date for journal entry this event belongs to.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly
   * @returns {Object} Updated event
   */
  async updateEntryEvent(
    {
      body: { eventId, content, URL, startTime, endTime, entryDate, type },
      params: { id },
    },
    res
  ) {
    // Get the start and end times
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    const propertyName = JournalController.getPropertyName(type);

    // Get index of entry we need by date
    const propertyIndex = journal[propertyName].findIndex((term) =>
      JournalController.isItem({ item: term, entryDate })
    );

    // Get index of event to update by id
    const eventIndex = journal[propertyName][propertyIndex].events.findIndex((event) =>
      JournalController.isItem({ item: event, id: eventId })
    );

    // Update event
    journal[propertyName][propertyIndex].events[eventIndex].content = content;
    journal[propertyName][propertyIndex].events[eventIndex].startTime = _startTime;
    journal[propertyName][propertyIndex].events[eventIndex].endTime = _endTime;
    journal[propertyName][propertyIndex].events[eventIndex].URL = URL;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get updated event
    const updatedEvent = journal[propertyName][propertyIndex].events[eventIndex];

    // Return new note
    return res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  }

  /**
   * Updates an event.
   * @param {string} id - User Id.
   * @param {string} eventId - Event Id.
   * @param {string} content - Updated content for event.
   * @param {string} URL - URL for this event.
   * @param {Date} startTime - Start time for this event.
   * @param {Date} endTime - End time for this event.
   * @param {string} termId - Term Id.
   * @param {string} weekNumber - Week number for this term
   * @returns {Object} Updated event
   */
  async updateTermEvent(
    {
      body: { eventId, content, URL, startTime, endTime, termId, weekNumber },
      params: { id },
    },
    res
  ) {
    // Get the start and end times
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get index of entry we need by date
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Get index of event to update by id
    const eventIndex = journal.terms[termIndex].weeks[
      weekNumber
    ].events.findIndex((event) => JournalController.isItem({ item: event, id: eventId }));

    // Update event
    journal.terms[termIndex].weeks[weekNumber].events[eventIndex].content = content;
    journal.terms[termIndex].weeks[weekNumber].events[eventIndex].startTime = _startTime;
    journal.terms[termIndex].weeks[weekNumber].events[eventIndex].endTime = _endTime;
    journal.terms[termIndex].weeks[weekNumber].events[eventIndex].URL = URL;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get updated event
    const updatedEvent = journal.terms[termIndex].weeks[weekNumber].events[eventIndex];

    // Return new note
    return res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  }

  /**
   * Updates a collection event.
   * @param {string} id - User Id.
   * @param {string} eventId - Event Id.
   * @param {string} content - Updated content for event.
   * @param {string} URL - URL for this event.
   * @param {Date} startTime - Start time for this event.
   * @param {Date} endTime - End time for this event.
   * @param {string} collectionId - Collection Id.
   * @returns {Object} Updated event
   */

  async updateCollectionEvent(
    { body: { eventId, content, URL, startTime, endTime, collectionId }, params: { id } },
    res
  ) {
    // Get the start and end times
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get index of entry we need by date
    const collectionIndex = journal.collections.findIndex((collection) =>
      JournalController.isItem({ item: collection, id: collectionId })
    );

    // Get index of task to update by id
    const eventIndex = journal.collections[collectionIndex].events.findIndex((event) =>
      JournalController.isItem({ item: event, id: eventId })
    );

    // Update event
    journal.collections[collectionIndex].events[eventIndex].content = content;
    journal.collections[collectionIndex].events[eventIndex].startTime = _startTime;
    journal.collections[collectionIndex].events[eventIndex].endTime = _endTime;
    journal.collections[collectionIndex].events[eventIndex].URL = URL;

    // Attempt to save changes to journal
    try {
      await journal.save();
      // Failed to validate the schema for this model
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
    // Get updated event
    const updatedEvent = journal.collections[collectionIndex].events[eventIndex];

    // Return new note
    return res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  }

  /**
   * Deletes an entry event.
   * @param {string} id - Id for this user.
   * @param {string} eventId - Id for this event.
   * @param {Date} entryDate - Date for this journal entry.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly.
   * @returns {boolean} Success status
   */
  async deleteEntryEvent({ body: { eventId, entryDate, type }, params: { id } }, res) {
    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
    // Get type of entries to access
    const propertyName = JournalController.getPropertyName(type);

    // Get index for the entry we need
    const propertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get the event to delete index
    const eventIndex = journal[propertyName][propertyIndex].events.findIndex((event) =>
      JournalController.isItem({ item: event, id: eventId })
    );

    // Remove event
    await journal[propertyName][propertyIndex].events[eventIndex].remove();

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
   * Deletes a term event.
   * @param {string} id - Id for this user.
   * @param {string} eventId - Id for this event.
   * @param {string} termId - Collection Id.
   * @param {string} weekNumber - Week number for term.
   * @returns {boolean} Success status
   */
  async deleteTermEvent({ body: { eventId, termId, weekNumber }, params: { id } }, res) {
    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
    // Get the term this event belongs to
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Using termIndex and weekNumber, get the index of the event to delete
    const eventIndex = journal.terms[termIndex].weeks[
      weekNumber
    ].events.findIndex((event) => JournalController.isItem({ item: event, id: eventId }));

    // Delete event
    await journal.terms[termIndex].weeks[weekNumber].events[eventIndex].remove();

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
   * Deletes a collection event.
   * @param {string} id - Id for this user.
   * @param {string} eventId - Id for this event.
   * @param {string} collectionId - Collection Id.
   * @returns {boolean} Success status
   */
  async deleteCollectionEvent({ body: { eventId, collectionId }, params: { id } }, res) {
    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
    // Get index of collection to access
    const collectionIndex = journal.collections.findIndex((collection) =>
      JournalController.isItem({ item: collection, id: collectionId })
    );

    // Get index for this event
    const eventIndex = journal.collections[collectionIndex].events.findIndex((event) =>
      JournalController.isItem({ item: event, id: eventId })
    );

    // Delete event
    await journal.collections[collectionIndex].events[eventIndex].remove();

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
   * @param {string} id - User Id.
   * @param {string} taskId - Task Id.
   * @param {Date} entryDate - Date of journal entry.
   * @param {Date} migrateDate - Date of journal entry event is being moved to.
   * @param {string} type - Type of journal entry, i,e, daily, weekly, or monthly.
   * @returns {Object} Updated task.
   */
  async migrateEntryTask(
    { body: { taskId, entryDate, migrateDate, type }, params: { id } },
    res
  ) {
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
    const originPropertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get the index for the task we're trying to move
    const taskIndex = journal[propertyName][originPropertyIndex].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Get the index of the entry which this task is being moved to
    const destPropertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({
        item: entry,
        entryDate: migrateDate,
      })
    );

    // Get copy of task
    const taskCopy = journal[propertyName][originPropertyIndex].tasks[taskIndex];

    // Add task
    journal[propertyName][destPropertyIndex].tasks.push(taskCopy);

    // Remove task from old entry
    journal[propertyName][originPropertyIndex].tasks[taskIndex].remove();

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
      data: taskCopy,
    });
  }

  /**
   * Moves a note from one journal entry to another.
   * @param {string} id - User Id.
   * @param {string} taskId - Task Id.
   * @param {string} termId - Term Id.
   * @param {number} weekNumber - Week number in this term.
   * @param {number} migrateWeekNumber - Week number to move task to.
   * @returns {Object} Updated task.
   */
  async migrateTermTask(
    { body: { taskId, termId, weekNumber, migrateWeekNumber }, params: { id } },
    res
  ) {
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

    // Get the index for the term which has the task we're trying to move
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Get the index for the task we're trying to move
    const taskIndex = journal.terms[termIndex].weeks[weekNumber].tasks.findIndex((task) =>
      JournalController.isItem({ item: task, id: taskId })
    );

    // Get copy of task
    const taskCopy = journal.terms[termIndex].weeks[weekNumber].tasks[taskIndex];

    // Add task
    journal.terms[termIndex].weeks[migrateWeekNumber].tasks.push(taskCopy);

    // Remove task from old week
    journal.terms[termIndex].weeks[weekNumber].tasks[taskIndex].remove();

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
      data: taskCopy,
    });
  }

  /**
   * Moves a note from one journal entry to another.
   * @param {string} id - User Id.
   * @param {string} noteId - Note Id.
   * @param {Date} entryDate - Date of journal entry.
   * @param {Date} migrateDate - Date of journal entry event is being moved to.
   * @returns {Object} Updated note.
   */
  async migrateEntryNote(
    { body: { noteId, type, entryDate, migrateDate }, params: { id } },
    res
  ) {
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
    const originPropertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get the index for the note we're moving
    const noteIndex = journal[propertyName][originPropertyIndex].notes.findIndex((note) =>
      JournalController.isItem({ item: note, id: noteId })
    );

    // Get the index for the entry which this note is being moved to
    const destPropertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({
        item: entry,
        entryDate: migrateDate,
      })
    );
    // Get copy of note
    const noteCopy = journal[propertyName][originPropertyIndex].notes[noteIndex];

    // Push note to new destination entry
    journal[propertyName][destPropertyIndex].notes.push(noteCopy);

    // Remove note from old entry
    journal[propertyName][originPropertyIndex].notes[noteIndex].remove();

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
      data: noteCopy,
    });
  }

  /**
   * Moves a term note from one week to another.
   * @param {string} id - User Id.
   * @param {string} noteId - Note Id.
   * @param {string} content - Updated content for this event.
   * @param {string} termId - Term Id.
   * @param {number} weekNumber - Week number in this term.
   * @param {Date} migrateWeekNumber - Week number note is being moved to
   * @returns {Object} Updated note.
   */
  async migrateTermNote(
    { body: { noteId, termId, weekNumber, migrateWeekNumber }, params: { id } },
    res
  ) {
    // Initialize Journal
    let journal;

    // Attempt to find Journal() object with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the index for the term which has the task we're trying to move
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Get the index for the task we're trying to move
    const noteIndex = journal.terms[termIndex].weeks[weekNumber].notes.findIndex((task) =>
      JournalController.isItem({ item: task, id: noteId })
    );
    // Get copy of task
    const noteCopy = journal.terms[termIndex].weeks[weekNumber].notes[noteIndex];

    // Add task to new week
    journal.terms[termIndex].weeks[migrateWeekNumber].notes.push(noteCopy);

    // Remove task from old week
    journal.terms[termIndex].weeks[weekNumber].notes[noteIndex].remove();

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
      data: noteCopy,
    });
  }

  /**
   * Moves an event from one journal entry to another.
   * @param {string} id - User Id.
   * @param {string} eventId - Event Id.
   * @param {Date} entryDate - Date of journal entry.
   * @param {Date} migrateDate - Date of journal entry event is being moved to.
   * @param {string} type - Type of journal entry, i.e. daily, weekly, monthly.
   * @returns {Object} Updated event.
   */
  async migrateEntryEvent(
    { body: { eventId, entryDate, migrateDate, type }, params: { id } },
    res
  ) {
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
    const originPropertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({ item: entry, entryDate })
    );

    // Get index of the event we're going to move
    const eventIndex = journal[propertyName][
      originPropertyIndex
    ].events.findIndex((event) => JournalController.isItem({ item: event, id: eventId }));

    // Get index of the entry which were moving this event to
    const destPropertyIndex = journal[propertyName].findIndex((entry) =>
      JournalController.isItem({
        item: entry,
        entryDate: migrateDate,
      })
    );

    // Get copy of event to move
    const eventCopy = journal[propertyName][originPropertyIndex].events[eventIndex];

    // Add event to new future entry
    journal[propertyName][destPropertyIndex].events.push(eventCopy);

    // Remove event from old entry
    journal[propertyName][originPropertyIndex].events[eventIndex].remove();

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
      data: eventCopy,
    });
  }

  /**
   * Moves a term event from one week to another.
   * @param {string} id - User Id.
   * @param {string} eventId - Event Id.
   * @param {string} termId - Term Id.
   * @param {number} weekNumber - Week number in term.
   * @param {number} migrateWeekNumber - Term week number to move event to
   * @returns {Object} Updated event
   */
  async migrateTermEvent(
    { body: { eventId, termId, weekNumber, migrateWeekNumber }, params: { id } },
    res
  ) {
    // Initialize for journal()
    let journal;

    // Attempt to find current journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Get the index for the term which has the event we're trying to move
    const termIndex = journal.terms.findIndex((term) =>
      JournalController.isItem({ item: term, id: termId })
    );

    // Get the index for the event we're trying to move
    const eventIndex = journal.terms[termIndex].weeks[
      weekNumber
    ].events.findIndex((task) => JournalController.isItem({ item: task, id: eventId }));

    // Get copy of event to move
    const eventCopy = journal.terms[termIndex].weeks[weekNumber].events[eventIndex];

    // Add task
    journal.terms[termIndex].weeks[migrateWeekNumber].events.push(eventCopy);

    // Remove task from old week
    journal.terms[termIndex].weeks[weekNumber].events[eventIndex].remove();

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
      data: eventCopy,
    });
  }
}
