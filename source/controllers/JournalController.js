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
   * @param {string} id - Id from User to retrieve their Journal
   * @returns {object} New journal entry.
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
   * @returns {object} New journal entry.
   */
  async getJournalEntry(req, res) {
    // Get date for this entry and user id
    const {
      params: { id, date, type },
    } = req;

    // Convert date back to Date object
    const _date = new Date(date);

    // Attempt to get journal for this user
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    const find = (entries) =>
      entries.find(
        (e) =>
          e.date.getDate() === _date.getDate() &&
          e.date.getMonth() === _date.getMonth() &&
          e.date.getFullYear() === _date.getFullYear()
      );

    let entry;
    // Get entry based on given type
    if (type === 'Daily') {
      const { dailyEntries } = journal;
      entry = find(dailyEntries);
      // Semesterly
    } else if (type === 'Semesterly') {
      const { semesterlyEntries } = journal;
      entry = find(semesterlyEntries);
      // Quarterly
    } else if (type === 'Quarterly') {
      const { quarterlyEntries } = journal;
      entry = find(quarterlyEntries);
      // Weekly
    } else if (type === 'Weekly') {
      const { weeklyEntries } = journal;
      entry = find(weeklyEntries);
      // Monthly
    } else {
      const { monthlyEntries } = journal;
      entry = find(monthlyEntries);
    }

    // return false if entry doesn't exist
    if (!entry) {
      return res.status(400).json({
        success: false,
      });
    }

    try {
      await journal.save();
    } catch (error) {
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
   * @returns {object} All journal entries within this range (inclusive)
   */
  async getJournalEntries(req, res) {
    // Get user id, from date, to date, and type of entries to retrieve
    const {
      params: { id, fromDate, toDate, type },
    } = req;

    // Convert from and to dates back to Date objects
    const _fromDate = new Date(fromDate);
    const _toDate = new Date(toDate);

    // Attempt to get this user journal
    let journal;
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Filter function for getting correct entries based on
    // the given from and to dates
    const filter = (entries) => {
      const _entries = entries.filter(
        (entry) =>
          entry.date.getTime() >= _fromDate.getTime() &&
          entry.date.getTime() <= _toDate.getTime()
      );

      return _entries;
    };

    let filteredEntries;

    // Get entries based on given type
    if (type === 'Daily') {
      const { dailyEntries } = journal;
      filteredEntries = filter(dailyEntries);
      // Semesterly
    } else if (type === 'Semesterly') {
      const { semesterlyEntries } = journal;
      filteredEntries = filter(semesterlyEntries);
      // Quarterly
    } else if (type === 'Quarterly') {
      const { quarterlyEntries } = journal;
      filteredEntries = filter(quarterlyEntries);
      // Weekly
    } else if (type === 'Weekly') {
      const { weeklyEntries } = journal;
      filteredEntries = filter(weeklyEntries);
      // Monthly
    } else {
      const { monthlyEntries } = journal;
      filteredEntries = filter(monthlyEntries);
    }

    // return the filtered entries
    return res.status(200).json({
      success: true,
      data: filteredEntries,
    });
  }

  // /**
  //  * Moves a task from one journal entry to another.
  //  * @param {object} moveTask - Information to create new journal entry
  //  * @returns {object} migrated task.
  //  */
  async migrateTask(req, res) {
    const {
      body: { taskId, content, entryDate, dueDate, migrateDate, type },
      params: { id },
    } = req;

    // Get date for this current entry
    const _entryDate = new Date(entryDate);
    // Get date for destination entry
    const _migrateDate = new Date(migrateDate);
    // Get the due date if applicable
    const _dueDate = new Date(dueDate);

    // Construct new task object based on current entry task
    let moveTask = {
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
    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();
    // Callback function for finding index of destination journal entry for destination date
    const isDestinationDate = (entry) =>
      entry.date.getDate() === _migrateDate.getDate() &&
      entry.date.getMonth() === _migrateDate.getMonth() &&
      entry.date.getFullYear() === _migrateDate.getFullYear();

    // Callback function to find correct task in current entry
    const isTaskToMigrate = (task) => task._id.toString() === taskId;

    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get index for task within the current entry to move
      const taskIndex = journal.dailyEntries[dailyIndex].tasks.findIndex(
        isTaskToMigrate
      );
      // Getting specific task from current entry of type Daily
      moveTask = journal.dailyEntries[dailyIndex].tasks[taskIndex];
      // Get index for correct destination entry
      const destIndex = journal.dailyEntries.findIndex(isDestinationDate);
      // Remove task from current entry
      journal.dailyEntries[dailyIndex].tasks[taskIndex].remove();
      // Push task to destination entry
      journal.dailyEntries[destIndex].tasks.push(moveTask);
      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.findIndex(
        isCurrentDate
      );
      // Get index for task within the current entry to move
      const taskIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].tasks.findIndex(isTaskToMigrate);
      // Getting specific task from current entry of type semesterly
      moveTask = journal.semesterlyEntries[semesterlyIndex].tasks[taskIndex];
      // Get index for correct destination entry
      const destIndex = journal.semesterlyEntries.findIndex(isDestinationDate);
      // Remove task from current entry
      journal.semesterlyEntries[semesterlyIndex].tasks[taskIndex].remove();
      // Push task to destination entry
      journal.semesterlyEntries[destIndex].tasks.push(moveTask);
      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.findIndex(isCurrentDate);
      // Get index for task within the current entry to move
      const taskIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].tasks.findIndex(isTaskToMigrate);
      // Getting specific task from current entry of type quarterly
      moveTask = journal.quarterlyEntries[quarterlyIndex].tasks[taskIndex];
      // Get index for correct destination entry
      const destIndex = journal.quarterlyEntries.findIndex(isDestinationDate);
      // Remove task from current destination
      journal.quarterlyEntries[quarterlyIndex].tasks[taskIndex].remove();
      // Push task to destination entry
      journal.quarterlyEntries[destIndex].tasks.push(moveTask);
      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.findIndex(isCurrentDate);
      // Get index for task within the current entry to move
      const taskIndex = journal.weeklyEntries[weeklyIndex].tasks.findIndex(
        isTaskToMigrate
      );
      // Getting specific task from current entry of type weekly
      moveTask = journal.weeklyEntries[weeklyIndex].tasks[taskIndex];
      // Get index for correct destination entry
      const destIndex = journal.weeklyEntries.findIndex(isDestinationDate);
      // Remove task from current entry
      journal.weeklyEntries[weeklyIndex].tasks[taskIndex].remove();
      // Push task to destination entry
      journal.weeklyEntries[destIndex].tasks.push(moveTask);
      // Else if this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.findIndex(isCurrentDate);
      // Get index for task within the current entry to move
      const taskIndex = journal.monthlyEntries[monthlyIndex].tasks.findIndex(
        isTaskToMigrate
      );
      // Getting specific task from current entry of type monthly
      moveTask = journal.monthlyEntries[monthlyIndex].tasks[taskIndex];
      // Remove task from current destination
      journal.monthlyEntries[monthlyIndex].tasks[taskIndex].remove();
      // Get index for correct destination entry
      const destIndex = journal.monthlyEntries.findIndex(isDestinationDate);
      // Push task to destination entry
      journal.monthlyEntries[destIndex].tasks.push(moveTask);
      // Remove task from current entry
      journal.monthlyEntries[monthlyIndex].tasks[taskIndex].remove();
    }

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

  // /**
  //  * Moves a note from one journal entry to another.
  //  * @param {object} moveNote - Information to create new journal entry
  //  * @returns {object} migrated note.
  //  */
  async migrateNote(req, res) {
    const {
      body: { noteId, content, type, entryDate, migrateDate },
      params: { id },
    } = req;
    // Get date for current entry
    const _entryDate = new Date(entryDate);
    // Get date for migrate entry
    const _migrateDate = new Date(migrateDate);

    // Construct notes
    let moveNote = {
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

    // Callback function for finding index of current journal entry
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();
    // Callback function for finding index of destination journal entry
    const isDestinationDate = (entry) =>
      entry.date.getDate() === _migrateDate.getDate() &&
      entry.date.getMonth() === _migrateDate.getMonth() &&
      entry.date.getFullYear() === migrateDate.getFullYear();

    const isNoteToMigrate = (note) => note._id.toString() === noteId;

    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get index for note within current entry
      const noteIndex = journal.dailyEntries[dailyIndex].notes.findIndex(
        isNoteToMigrate
      );
      // Get specific note from current entry of type Daily
      moveNote = journal.dailyEntries[dailyIndex].notes[noteIndex];
      // Get index for correct destination entry
      const destIndex = journal.dailyEntries.findIndex(isDestinationDate);
      // Push note to destination entry
      journal.dailyEntries[destIndex].notes.push(moveNote);
      // Remove note from current entry
      journal.dailyEntries[dailyIndex].notes[noteIndex].remove();
      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.findIndex(
        isCurrentDate
      );
      // Get index for note within current entry
      const noteIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].notes.findIndex(isNoteToMigrate);
      // Get specific note from current entry of type semesterly
      moveNote = journal.semesterlyEntries[semesterlyIndex].notes[noteIndex];
      // Get index for correct destination entry
      const destIndex = journal.semesterlyEntries.findIndex(isDestinationDate);
      // Push note to destination entry
      journal.semesterlyEntries[destIndex].notes.push(moveNote);
      // Remove note from current entry
      journal.semesterlyEntries[semesterlyIndex].notes[noteIndex].remove();
      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.findIndex(isCurrentDate);
      // Get index for note within current entry
      const noteIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].notes.findIndex(isNoteToMigrate);
      // Get specific note from current entry of type quarterly
      moveNote = journal.quarterlyEntries[quarterlyIndex].notes[noteIndex];
      // Get index for correct destination entry
      const destIndex = journal.quarterlyEntries.findIndex(isDestinationDate);
      // Push note to destination entry
      journal.quarterlyEntries[destIndex].notes.push(moveNote);
      // Remove note from current entry
      journal.quarterlyEntries[quarterlyIndex].notes[noteIndex].remove();
      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.findIndex(isCurrentDate);
      // Get index for note within current entry
      const noteIndex = journal.weeklyEntries[weeklyIndex].notes.findIndex(
        isNoteToMigrate
      );
      // Get specific note from current entry of type weekly
      moveNote = journal.weeklyEntries[weeklyIndex].notes[noteIndex];
      // Get index for correct destination entry
      const destIndex = journal.weeklyEntries.findIndex(isDestinationDate);
      // Push note to destination entry
      journal.weeklyEntries[destIndex].notes.push(moveNote);
      // Remove note from current entry
      journal.weeklyEntries[weeklyIndex].notes[noteIndex].remove();
      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.findIndex(isCurrentDate);
      // Get index for note within current entry
      const noteIndex = journal.monthlyEntries[monthlyIndex].notes.findIndex(
        isNoteToMigrate
      );
      // Get specific note from current entry of type monthly
      moveNote = journal.monthlyEntries[monthlyIndex].notes[noteIndex];
      // Get index for correct destination entry
      const destIndex = journal.monthlyEntries.findIndex(isDestinationDate);
      // Push note to destination entry
      journal.monthlyEntries[destIndex].notes.push(moveNote);
      // Remove note from current entry
      journal.monthlyEntries[monthlyIndex].notes[noteIndex].remove();
    }

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

  // /**
  //  * Moves an event from one journal entry to another.
  //  * @param {object} moveEvent - Information to create new journal entry
  //  * @returns {object} migrated event.
  //  */
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
    // Get the entry date passed in for current journal entry
    const _entryDate = new Date(entryDate);
    // Get the destination date for the destination entry
    const _migrateDate = new Date(migrateDate);
    // Get start and end time for this event
    const _startTime = new Date(startTime);
    const _endTime = new Date(endTime);

    // Construct event Object
    let moveEvent = {
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

    // Callback function for finding index of current journal entry
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();
    // Callback function for finding index of destination journal entry
    const isDestinationDate = (entry) =>
      entry.date.getDate() === _migrateDate.getDate() &&
      entry.date.getMonth() === _migrateDate.getMonth() &&
      entry.date.getFullYear() === _migrateDate.getFullYear();
    // Callback function for finding index of event to migrate
    const isEventToMigrate = (event) => event._id.toString() === eventId;

    if (type === 'Daily') {
      // Get index of daily entries
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get index of event in that entry
      const eventIndex = journal.dailyEntries[dailyIndex].events.findIndex(
        isEventToMigrate
      );
      // Get specific event from current entry of type Daily
      moveEvent = journal.dailyEntries[dailyIndex].events[eventIndex];
      // Get index for correct destination entry
      const destIndex = journal.dailyEntries.findIndex(isDestinationDate);
      // Push event to destination entry
      journal.dailyEntries[destIndex].events.push(moveEvent);
      // Remove event from current entry
      journal.dailyEntries[dailyIndex].events[eventIndex].remove();
      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index of semesterly entries
      const semesterlyIndex = journal.semesterlyEntries.findIndex(
        isCurrentDate
      );
      // Get index of event in that entry
      const eventIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].events.findIndex(isEventToMigrate);
      // Get specific event from current entry of type semesterly
      moveEvent = journal.semesterlyEntries[semesterlyIndex].events[eventIndex];
      // Get index for correct destination entry
      const destIndex = journal.semesterlyEntries.findIndex(isDestinationDate);
      // Push event to destination entry
      journal.semesterlyEntries[destIndex].events.push(moveEvent);
      // Remove event from current entry
      journal.semesterlyEntries[semesterlyIndex].events[eventIndex].remove();
      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index of quarterly entries
      const quarterlyIndex = journal.quarterlyEntries.findIndex(isCurrentDate);
      // Get index of event in that entry
      const eventIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].events.findIndex(isEventToMigrate);
      // Get specific event from current entry of type quarterly
      moveEvent = journal.quarterlyEntries[quarterlyIndex].events[eventIndex];
      // Get index for correct destination entry
      const destIndex = journal.quarterlyEntries.findIndex(isDestinationDate);
      // Push event to destination entry
      journal.quarterlyEntries[destIndex].events.push(moveEvent);
      // Remove event from current entry
      journal.quarterlyEntries[quarterlyIndex].events[eventIndex].remove();
      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index of weekly entries
      const weeklyIndex = journal.weeklyEntries.findIndex(isCurrentDate);
      // Get index of event in that entry
      const eventIndex = journal.weeklyEntries[weeklyIndex].events.findIndex(
        isEventToMigrate
      );
      // Get specific event from current entry of type weekly
      moveEvent = journal.weeklyEntries[weeklyIndex].events[eventIndex];
      // Get index for correct destination entry
      const destIndex = journal.weeklyEntries.findIndex(isDestinationDate);
      // Push event to destination entry
      journal.weeklyEntries[destIndex].events.push(moveEvent);
      // Remove event from current entry
      journal.weeklyEntries[weeklyIndex].events[eventIndex].remove();
      // Else if this is a monthly entry
    } else {
      // Get index of monthly entries
      const monthlyIndex = journal.monthlyEntries.findIndex(isCurrentDate);
      // Get index of event in that entry
      const eventIndex = journal.monthlyEntries[monthlyIndex].events.findIndex(
        isEventToMigrate
      );
      // Get specific event from current entry of type monthly
      moveEvent = journal.monthlyEntries[monthlyIndex].events[eventIndex];
      // Get index for correct destination entry
      const destIndex = journal.monthlyEntries.findIndex(isDestinationDate);
      // Push event to destination entry
      journal.monthlyEntries[destIndex].events.push(moveEvent);
      // Remove event from current entry
      journal.monthlyEntries[monthlyIndex].events[eventIndex].remove();
    }

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

    // If we made it here, then we found the journal and we
    // need to find what type of entry we're inserting
    // If this is a new daily entry
    if (type === 'Daily') {
      journal.dailyEntries.push(newEntry);
      // Else if this is a new quarterly entry
    } else if (type === 'Quarterly') {
      journal.quarterlyEntries.push(newEntry);
      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      journal.semesterlyEntries.push(newEntry);
      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      journal.weeklyEntries.push(newEntry);
      // Else this is a monthly entry
    } else {
      journal.monthlyEntries.push(newEntry);
    }

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

    // Get date for this entry
    const _entryDate = new Date(entryDate);
    // Get the due date if applicable
    const _dueDate = new Date(dueDate);

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

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // If this is a daily entry
    if (type === 'Daily') {
      // Get index for correct daily entry
      const index = journal.dailyEntries.findIndex(isCurrentDate);
      // Push new task
      journal.dailyEntries[index].tasks.push(newTask);

      // Else if this is a term entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const index = journal.quarterlyEntries.findIndex(isCurrentDate);
      // Push new task
      journal.quarterlyEntries[index].tasks.push(newTask);

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      const index = journal.semesterlyEntries.findIndex(isCurrentDate);
      // Push new task
      journal.semesterlyEntries[index].tasks.push(newTask);

      // Else if this is a weekly entry|
    } else if (type === 'Weekly') {
      // Get index for correct weekly entrydate
      const index = journal.weeklyEntries.findIndex(isCurrentDate);
      // Push new Task
      journal.weeklyEntries[index].tasks.push(newTask);
      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const index = journal.monthlyEntries.findIndex(isCurrentDate);
      // Push new task
      journal.monthlyEntries[index].tasks.push(newTask);
    }

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
   * @param {string} id - User Id
   * @param {string} content - Updated content for task.
   * @param {Date} dueDate - Due date for task.
   * @param {Date} entryDate - Date for journal entry this event belongs to.
   * @param {string} type - Type of journal entry
   * @returns {object} Updated event
   */
  async updateTask(req, res) {
    // Get passed in data, and user id for finding journal
    const {
      body: { taskId, content, entryDate, dueDate, type },
      params: { id },
    } = req;

    // Get date for this entry
    const _entryDate = new Date(entryDate);
    // Get due date
    const _dueDate = new Date(dueDate);

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

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // Callback function for finding index of task to update
    const isTaskToUpdate = (task) => task._id.toString() === taskId;

    // If this is a daily entry
    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get index for task to update within daily entry
      const taskIndex = journal.dailyEntries[dailyIndex].tasks.findIndex(
        isTaskToUpdate
      );
      // Push new task
      journal.dailyEntries[dailyIndex].tasks[taskIndex] = updatedTask;

      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.findIndex(isCurrentDate);
      // Get index for task to update within quarterly entry
      const taskIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].tasks.findIndex(isTaskToUpdate);
      // Push new task
      journal.quarterlyEntries[quarterlyIndex].tasks[taskIndex] = updatedTask;

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.findIndex(
        isCurrentDate
      );
      // Get index for task to update within semesterly entry
      const taskIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].tasks.findIndex(isTaskToUpdate);
      // Push new task
      journal.semesterlyEntries[semesterlyIndex].tasks[taskIndex] = updatedTask;

      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.findIndex(isCurrentDate);
      // Get index for task to update within weekly entry
      const taskIndex = journal.weeklyEntries[weeklyIndex].tasks.findIndex(
        isTaskToUpdate
      );
      // Push new task
      journal.weeklyEntries[weeklyIndex].tasks[taskIndex] = updatedTask;

      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.findIndex(isCurrentDate);
      // Get index for task to update within monthly entry
      const taskIndex = journal.monthlyEntries[monthlyIndex].tasks.findIndex(
        isTaskToUpdate
      );
      // Push new task
      journal.monthlyEntries[monthlyIndex].tasks[taskIndex] = updatedTask;
    }

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
   * @param {Date} type - Date for this journal entry
   * @param {string} type - Type of journal entry this task is related to.
   *
   */
  async deleteTask(req, res) {
    // Get passed in data, and user id for finding journal
    const {
      body: { taskId, entryDate, type },
      params: { id },
    } = req;

    const _entryDate = new Date(entryDate);

    // Initialize for Journal() object
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find this journal
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // Callback function for finding index of task to delete
    const isTaskToDelete = (task) => task._id.toString() === taskId;

    // If this is a daily entry
    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get index for task to delete
      const taskIndex = journal.dailyEntries[dailyIndex].tasks.findIndex(
        isTaskToDelete
      );

      // Delete this task
      await journal.dailyEntries[dailyIndex].tasks[taskIndex].remove();

      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.findIndex(isCurrentDate);
      // Get index for task to delete
      const taskIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].tasks.findIndex(isTaskToDelete);
      // Delete this task
      await journal.quarterlyEntries[quarterlyIndex].tasks[taskIndex].remove();

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.findIndex(
        isCurrentDate
      );
      // Get index for task to delete
      const taskIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].tasks.findIndex(isTaskToDelete);
      // Delete this task
      await journal.semesterlyEntries[semesterlyIndex].tasks[
        taskIndex
      ].remove();

      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct daily entry
      const weeklyIndex = journal.weeklyEntries.findIndex(isCurrentDate);
      // Get index for task to delete
      const taskIndex = journal.weeklyEntries[weeklyIndex].tasks.findIndex(
        isTaskToDelete
      );
      // Delete this task
      await journal.weeklyEntries[weeklyIndex].tasks[taskIndex].remove();

      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.findIndex(isCurrentDate);
      // Get index for task to delete
      const taskIndex = journal.monthlyEntries[monthlyIndex].tasks.findIndex(
        isTaskToDelete
      );
      // Delete this task
      await journal.monthlyEntries[monthlyIndex].tasks[taskIndex].remove();
    }

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

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // If this is a daily entry
    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Push new note
      journal.dailyEntries[dailyIndex].notes.push(newNote);

      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.dailyEntries.find(isCurrentDate);
      // Push new note
      journal.quarterlyEntries[quarterlyIndex].notes.push(newNote);

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.dailyEntries.find(isCurrentDate);
      // Push new note
      journal.semesterlyEntries[semesterlyIndex].notes.push(newNote);

      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.find(isCurrentDate);
      // Push new note
      journal.weeklyEntries[weeklyIndex].notes.push(newNote);
      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.find(isCurrentDate);
      // Push new note
      journal.monthlyEntries[monthlyIndex].notes.push(newNote);
    }

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

    const _entryDate = new Date(entryDate);

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

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // Callback function for finding index of note to update
    const isNotesToUpdate = (note) => note._id.toString() === noteId;

    // if this is a daily entry
    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get index for note to update within daily entry
      const noteIndex = journal.dailyEntries[dailyIndex].notes.findIndex(
        isNotesToUpdate
      );
      // Push updated note
      journal.dailyEntries[dailyIndex].notes[noteIndex] = updatedNote;

      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.findIndex(isCurrentDate);
      // Get index for note to update within quarterly entry
      const noteIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].notes.findIndex(isNotesToUpdate);
      // Push updated note
      journal.quarterlyEntries[quarterlyIndex].notes[noteIndex] = updatedNote;

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.findIndex(
        isCurrentDate
      );
      // Get index for note to update within semesterly entry
      const noteIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].notes.findIndex(isNotesToUpdate);
      // Push updated note
      journal.semesterlyEntries[semesterlyIndex].notes[noteIndex] = updatedNote;

      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.find(isCurrentDate);
      // Get index for note to update within weekly entry
      const noteIndex = journal.weeklyEntries[weeklyIndex].notes.findIndex(
        isNotesToUpdate
      );
      // Push updated note
      journal.weeklyEntries[weeklyIndex].notes[noteIndex] = updatedNote;

      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.find(isCurrentDate);
      // Get index for note to update within monthly entry
      const noteIndex = journal.monthlyEntries[monthlyIndex].notes.findIndex(
        isNotesToUpdate
      );
      // Push updated note
      journal.monthlyEntries[monthlyIndex].notes[noteIndex] = updatedNote;
    }

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
   *
   */
  async deleteNote(req, res) {
    // get passed in data and user id for finding journal
    const {
      body: { noteId, entryDate, type },
      params: { id },
    } = req;

    const _entryDate = new Date(entryDate);

    // Initialize journal
    let journal;

    // Attempt to find Journal() object with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // Callback function for finding index of note to update
    const isNotesToDelete = (note) => note._id.toString() === noteId;

    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get index for note to Delete
      const noteIndex = journal.dailyEntries[dailyIndex].notes.findIndex(
        isNotesToDelete
      );
      // Delete this note
      journal.dailyEntries[dailyIndex].notes[noteIndex].remove();

      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.findIndex(isCurrentDate);
      // Get index for note to Delete
      const noteIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].notes.findIndex(isNotesToDelete);
      // Delete this note
      journal.quarterlyEntries[quarterlyIndex].notes[noteIndex].remove();

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.findIndex(
        isCurrentDate
      );
      // Get index for note to Delete
      const noteIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].notes.findIndex(isNotesToDelete);
      // Delete this note
      journal.semesterlyEntries[semesterlyIndex].notes[noteIndex].remove();

      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.find(isCurrentDate);
      // Get index for note to Delete
      const noteIndex = journal.weeklyEntries[weeklyIndex].notes.findIndex(
        isNotesToDelete
      );
      // Delete this note
      journal.weeklyEntries[weeklyIndex].notes[noteIndex].remove();

      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.find(isCurrentDate);
      // Get index for note to Delete
      const noteIndex = journal.monthlyEntries[monthlyIndex].notes.findIndex(
        isNotesToDelete
      );
      // Delete this note
      journal.monthlyEntries[monthlyIndex].notes[noteIndex].remove();
    }

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

    // Get the entry date passed in for this journal
    const _entryDate = new Date(entryDate);
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

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // If this is a daily entry
    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Push new event
      journal.dailyEntries[dailyIndex].events.push(newEvent);

      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.find(isCurrentDate);
      // Push new event
      journal.quarterlyEntries[quarterlyIndex].events.push(newEvent);

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.find(isCurrentDate);
      // Push new event
      journal.semesterlyEntries[semesterlyIndex].events.push(newEvent);

      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.find(isCurrentDate);
      // Push new event
      journal.weeklyEntries[weeklyIndex].events.push(newEvent);

      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.find(isCurrentDate);
      // Push new event
      journal.monthlyEntries[monthlyIndex].events.push(newEvent);
    }

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

    // Get the entry date
    const _entryDate = new Date(entryDate);
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

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // Callback function for finding index of event to update
    const isEventToUpdate = (event) => event._id.toString() === eventId;

    // If this is a daily entry
    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get event index within daily entry
      const eventIndex = journal.dailyEntries[dailyIndex].events.findIndex(
        isEventToUpdate
      );
      // Push updated event
      journal.dailyEntries[dailyIndex].events[eventIndex] = updatedEvent;

      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.find(isCurrentDate);
      // Get event index within quarterly entry
      const eventIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].events.findIndex(isEventToUpdate);
      // Push updated event
      journal.quarterlyEntries[quarterlyIndex].events[
        eventIndex
      ] = updatedEvent;

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.find(isCurrentDate);
      // Get event index within semesterly entry
      const eventIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].events.findIndex(isEventToUpdate);
      // Push updated event
      journal.semesterlyEntries[semesterlyIndex].events[
        eventIndex
      ] = updatedEvent;

      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.find(isCurrentDate);
      // Get event index within weekly entry
      const eventIndex = journal.weeklyEntries[weeklyIndex].events.findIndex(
        isEventToUpdate
      );
      // Push updated event
      journal.weeklyEntries[weeklyIndex].events[eventIndex] = updatedEvent;

      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.find(isCurrentDate);
      // Get event index within monthly entry
      const eventIndex = journal.monthlyEntries[monthlyIndex].events.findIndex(
        isEventToUpdate
      );
      // Push updated event
      journal.monthlyEntries[monthlyIndex].events[eventIndex] = updatedEvent;
    }

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
   *
   */
  async deleteEvent(req, res) {
    // Get passed in data and user id for finding journal
    const {
      body: { eventId, entryDate, type },
      params: { id },
    } = req;

    // Get entry date
    const _entryDate = new Date(entryDate);
    // Initialize for Journal()
    let journal;

    // Attempt to find journal with user id
    try {
      journal = await this.Journal.findOne({ _id: id });
      // Failed to find journal for this user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Callback function for finding index of journal entry for this date
    const isCurrentDate = (entry) =>
      entry.date.getDate() === _entryDate.getDate() &&
      entry.date.getMonth() === _entryDate.getMonth() &&
      entry.date.getFullYear() === _entryDate.getFullYear();

    // Callback function for finding index of event to Delete
    const isEventToDelete = (event) => event._id.toString() === eventId;

    // If this is a daily entry
    if (type === 'Daily') {
      // Get index for correct daily entry
      const dailyIndex = journal.dailyEntries.findIndex(isCurrentDate);
      // Get event index within daily entry
      const eventIndex = journal.dailyEntries[dailyIndex].events.findIndex(
        isEventToDelete
      );
      // Delete this event
      journal.dailyEntries[dailyIndex].events[eventIndex].remove();

      // Else if this is a quarterly entry
    } else if (type === 'Quarterly') {
      // Get index for correct quarterly entry
      const quarterlyIndex = journal.quarterlyEntries.find(isCurrentDate);
      // Get event index within quarterly entry
      const eventIndex = journal.quarterlyEntries[
        quarterlyIndex
      ].events.findIndex(isEventToDelete);
      // Delete this event
      journal.quarterlyEntries[quarterlyIndex].events[eventIndex].remove();

      // Else if this is a semesterly entry
    } else if (type === 'Semesterly') {
      // Get index for correct semesterly entry
      const semesterlyIndex = journal.semesterlyEntries.find(isCurrentDate);
      // Get event index within semesterly entry
      const eventIndex = journal.semesterlyEntries[
        semesterlyIndex
      ].events.findIndex(isEventToDelete);
      // Delete this event
      journal.semesterlyEntries[semesterlyIndex].events[eventIndex].remove();

      // Else if this is a weekly entry
    } else if (type === 'Weekly') {
      // Get index for correct weekly entry
      const weeklyIndex = journal.weeklyEntries.find(isCurrentDate);
      // Get event index within weekly entry
      const eventIndex = journal.weeklyEntries[weeklyIndex].events.findIndex(
        isEventToDelete
      );
      // Delete this event
      journal.weeklyEntries[weeklyIndex].events[eventIndex].remove();

      // Else this is a monthly entry
    } else {
      // Get index for correct monthly entry
      const monthlyIndex = journal.monthlyEntries.find(isCurrentDate);
      // Get event index within monthly entry
      const eventIndex = journal.monthlyEntries[monthlyIndex].events.findIndex(
        isEventToDelete
      );
      // Delete this event
      journal.monthlyEntries[monthlyIndex].events[eventIndex].remove();
    }

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
