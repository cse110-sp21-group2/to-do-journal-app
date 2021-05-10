// import Journal from '../models/Journal';

export default class JournalController {
  // Set our passed in Journal model
  constructor(JournalModel) {
    this.Journal = JournalModel;
  }

  // TO-DO
  /**
   * Creates a new Journal.
   * @param {object} newEntry - Information to create new Journal
   * @returns {object} New Journal
   */
  async createJournal(req, res) {
    const newJournal = {
      _id: req.body.id,
      journalEntries: [],
    };
    try {
      // Get Journal model
      const {Journal} = this;

      // Create new Journal
      const journal = new Journal(newJournal);

      // Add to database
      journal.save();

      // successful
      res.status(200).json(journal);

    } catch (error) {
      // failed to create journal
      res.status(400).json({ success: false, error });
    }
  }

  /**
   * Gets journal in relation to the User
   * @param {object} newEntry - Id from User to retrieve their Journal
   * @returns {object} New journal entry.
   */
  async getJournal(req, res) {
    try {
      const journal = await this.Journal.findOne({ _id: req.params.id });

      res.status(200).json(journal);

    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }

  /**
   * Get a journal entry.
   * @param {string} date - Specific date for this journal entry
   * @returns {object} New journal entry.
   */
  async getJournalEntry(req, res) {
    try {
      const journalEntry = await this.Journal.findOne({ date: req.params.date });

      res.status(200).json(journalEntry);

    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }

  // TO-DO
  /**
   * Gets journal entries.
   * @param {string} startDate - Starting date for journal entries
   * @param {string} endDate - End date for journal entries
   * @returns {object} All journal entries within this range (inclusive)
   */
  async getJournalEntries(req, res) {
    try {
      // Query to find journal entries within this range
      const journalEntries = await this.Journal.find({ dateRange: req.params.dateRang });

      // If successful, return result in json
      res.status(200).json(journalEntries);

    } catch (error) {
      // Else query failed
      res.status(400).json({ success: false, error });
    }
  }

  // TO-DO
  /**
   * Get weekly journal entries.
   * @param {string} startDate - Starting date for journal entries
   * @param {string} endDate - End date for journal entries
   * @returns {object} New journal entry.
   */
  async getWeeklyJournalEntries(req, res) {}

  // TO-DO
  /**
   * Get monthly journal entries.
   * @param {string} month - Month to retrieve journal entries
   * @returns {object} Journal entries pertaining to given month
   */
  async getMonthlyJournalEntries(req, res) {}

  // TO-DO
  /**
   * Moves a task from one journal entry to another.
   * @param {object} updatedTask - Information to create new journal entry
   * @param {object} updatedTask - Information to create new journal entry
   * @returns {object} Updated task.
   */
  async migrateTask(req, res) {}

  // TO-DO
  /**
   * Moves a note from one journal entry to another.
   * @param {object} updatedNote - Information to create new journal entry
   * @returns {object} Updated note.
   */
  async migrateNote(req, res) {}

  // TO-DO
  /**
   * Moves an event from one journal entry to another.
   * @param {object} newEntry - Information to create new journal entry
   * @returns {object} Updated event.
   */
  async migrateEvent(req, res) {}

  // TO-DO
  /**
   * Creates a new journal entry.
   * @param {object} newEntry - Information to create new journal entry
   * @returns {object} New journal entry.
   */
   async createJournalEntry(req, res) {}

  // TO-DO
  /**
   * Creates a new task.
   * @param {object} newtask - Information to create new task
   * @returns {object} New task.
   */
  async addJournalEntryTask(req, res) {}

  // TO-DO
  /**
   * Updates a task.
   * @param {string} id - Id for journal entry task to update
   * @param {object} updateInfo - Information for updating task
   * @returns {object} Updated task
   */
  async updateJournalEntryTask(req, res) {}

  // TO-DO
  /**
   * Deletes a task.
   * @param {string} id - Id for this task.
   */
  async deleteJournalEntryTask(req, res) {}

  // TO-DO
  /**
   * Creates a new note.
   * @param {object} newNote - Information to create new note
   * @returns {object} New note.
   */
  async addJournalEntryNote(req, res) {}

  // TO-DO
  /**
   * Updates a note.
   * @param {string} id - Id for this note.
   * @param {object} updateInfo - Information for updating note
   * @returns {object} updatedNote - Updated note
   */
  async updateJournalEntryNote(req, res) {}

  // TO-DO
  /**
   * Deletes a note.
   * @param {string} id - Id for this note
   */
  async deleteJournalEntryNote(req, res) {}

  // TO-DO
  /**
   * Creates a new event.
   * @param {object} newEvent - Information to create new event.
   * @returns {object} New event.
   */
  async addJournalEntryEvent(req, res) {}

  // TO-DO
  /**
   * Updates an event
   * @param {string} id - Id for this event
   * @returns {object} Updated event.
   */
  async updateJournalEntryEvent(req, res) {}

  // TO-DO
  /**
   * Deletes an event.
   * @param {string} id - Id for this event.
   */
  async deleteJournalEntryEvent(req, res) {}
}
