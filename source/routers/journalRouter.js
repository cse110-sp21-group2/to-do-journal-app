import { Router } from 'express';
import JournalController from '../controllers/JournalController';
import Journal from '../models/Journal';

// Initialize a Router instance
const router = Router();

// Initialize new Journal Controller
const journalController = new JournalController(Journal);

router.get('/create-journal/:id', (req, res) => {
  journalController.createJournal(req, res);
});

/* v Routes for getting journal data v */

// Route for getting user's journal
router.get('/journal/:id', (req, res) => {
  journalController.getJournal(req, res);
});

// Route for getting journal entry for today's date
router.get('/journal-entry/:id&:date&:type', (req, res) => {
  journalController.getJournalEntry(req, res);
});

// Route for getting journal entries for specific date range
router.get('/journal-entries/:id&:fromDate&:toDate&:type', (req, res) => {
  journalController.getJournalEntries(req, res);
});

/* ^^ Routes for getting journal data ^^ */

/* v Routes for moving data to a new journal entry v */

// Route for moving task from one journal entry to another
router.put('/migrate-task/:id', (req, res) => {
  journalController.migrateTask(req, res);
});

// Route for moving note from one journal entry to another
router.put('/migrate-note/:id', (req, res) => {
  journalController.migrateNote(req, res);
});

// Route for moving event from one journal entry to another
router.put('/migrate-event/:id', (req, res) => {
  journalController.migrateEvent(req, res);
});

/* ^^ Routes for moving data to a new journal entry ^^ */

/* v Routes for adding data v */

// Route for creating a new journal entry
router.post('/add-journal-entry/:id', (req, res) => {
  journalController.addJournalEntry(req, res);
});

// Route for adding new task
router.post('/add-task/:id', (req, res) => {
  journalController.addTask(req, res);
});

// Route for adding new note
router.post('/add-note/:id', (req, res) => {
  journalController.addNote(req, res);
});

// Route for adding new event
router.post('/add-event/:id', (req, res) => {
  journalController.addEvent(req, res);
});

/* ^^ Routes for adding data ^^ */

/* v Routes for updating data v */

// Route for updating a task
router.put('/update-task/:id', (req, res) => {
  journalController.updateTask(req, res);
});

// Route for updating a note
router.put('/update-note/:id', (req, res) => {
  journalController.updateNote(req, res);
});

// Route for updating an event
router.put('/update-event/:id', (req, res) => {
  journalController.updateEvent(req, res);
});

/* ^^ Routes for updating data ^^ */

/* v Routes for deleting data v */

// Route for deleting a task
router.post('/delete-task/:id', (req, res) => {
  journalController.deleteTask(req, res);
});

// Route for deleting a note
router.post('/delete-note/:id', (req, res) => {
  journalController.deleteNote(req, res);
});

// Route for deleting an event
router.post('/delete-event/:id', (req, res) => {
  journalController.deleteEvent(req, res);
});

/* ^^ Routes for deleting data ^^ */

export default router;
