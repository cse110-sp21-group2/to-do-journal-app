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
   * @param {object} newEntry - Information to create new Journal
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
   * @param {object} newEntry - Id from User to retrieve their Journal
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
   * @param {string} date - Specific date for this journal entry
   * @returns {object} New journal entry.
   */
  async getJournalEntry(req, res) {
    // Get date for this entry and user id
    const {
      params: { id, date },
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

    // Get daily entries
    const { dailyEntries } = journal;

    // Try to find entry on this specific date
    let entry = dailyEntries.find(
      (e) =>
        e.date.getDate() === _date.getDate() &&
        e.date.getMonth() === _date.getMonth() &&
        e.date.getFullYear() === _date.getFullYear()
    );

    // If it doesn't exist then we'll create one and add it
    // to the journal daily entries
    if (!entry) {
      entry = {
        tasks: [],
        notes: [],
        events: [],
        date: _date,
      };
      journal.dailyEntries.push(entry);

      try {
        await journal.save();
      } catch (error) {
        return res.status(400).json({
          success: false,
        });
      }
    }

    // return entry
    return res.status(200).json({
      success: true,
      data: entry,
    });
  }

  /**
   * Gets journal entries.
   * @param {string} startDate - Starting date for journal entries
   * @param {string} endDate - End date for journal entries
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

  // // TO-DO
  // /**
  //  * Moves a task from one journal entry to another.
  //  * @param {object} updatedTask - Information to create new journal entry
  //  * @param {object} updatedTask - Information to create new journal entry
  //  * @returns {object} Updated task.
  //  */
  // async migrateTask(req, res) {}

  // // TO-DO
  // /**
  //  * Moves a note from one journal entry to another.
  //  * @param {object} updatedNote - Information to create new journal entry
  //  * @returns {object} Updated note.
  //  */
  // async migrateNote(req, res) {}

  // // TO-DO
  // /**
  //  * Moves an event from one journal entry to another.
  //  * @param {object} newEntry - Information to create new journal entry
  //  * @returns {object} Updated event.
  //  */
  // async migrateEvent(req, res) {}

  /**
   * Adds a new journal entry.
   * @param {object} newEntry - Information to create new journal entry
   * @returns {object} New journal entry.
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
   * @param {object} newtask - Information to create new task
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
   * @param {string} date - Date for journal entry this task belongs to
   * @param {string} id - Id for journal entry task to update
   * @param {object} updateInfo - Information for updating task
   * @returns {object} Updated task
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
   * @param {object} newNote - Information to create new note
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
   * @param {string} id - Id for this note.
   * @param {object} updateInfo - Information for updating note
   * @returns {object} updatedNote - Updated note
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
   * @param {string} id - Id for this note
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
   * @param {object} newEvent - Information to create new event.
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
   * Updates an event
   * @param {string} id - Id for this event
   * @returns {object} Updated event.
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
   * @param {string} id - Id for this event.
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
