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

// Route for getting journal term
router.get('/journal-term/:id&:termId', (req, res) => {
  journalController.getJournalTerm(req, res);
});

// Route for getting journal collection
router.get('/journal-collection/:id&:collectionId', (req, res) => {
  journalController.getJournalCollection(req, res);
});

/* ^^ Routes for getting journal data ^^ */

/* v Routes for adding data v */

// Route for creating a new journal entry
router.post('/add-journal-entry/:id', (req, res) => {
  journalController.addJournalEntry(req, res);
});

// Route for creating a new journal term
router.post('/add-journal-term/:id', (req, res) => {
  journalController.addJournalCollection(req, res);
});

// Route for creating a new journal collection
router.post('/add-journal-collection/:id', (req, res) => {
  journalController.addJournalCollection(req, res);
});

// Route for adding new entry task
router.post('/add-entry-task/:id', (req, res) => {
  journalController.addEntryTask(req, res);
});

// Route for adding new entry note
router.post('/add-entry-note/:id', (req, res) => {
  journalController.addEntryNote(req, res);
});

// Route for adding new entry event
router.post('/add-entry-event/:id', (req, res) => {
  journalController.addEntryEvent(req, res);
});

// Route for adding new term task
router.post('/add-term-task/:id', (req, res) => {
  journalController.addTermTask(req, res);
});

// Route for adding new term note
router.post('/add-term-note/:id', (req, res) => {
  journalController.addTermNote(req, res);
});

// Route for adding new term event
router.post('/add-term-event/:id', (req, res) => {
  journalController.addTermEvent(req, res);
});

// Route for adding new collection note
router.post('/add-collection-note/:id', (req, res) => {
  journalController.addCollectionNote(req, res);
});

// Route for adding new collection event
router.post('/add-collection-event/:id', (req, res) => {
  journalController.addCollectionEvent(req, res);
});

/* ^^ Routes for adding data ^^ */

/* v Routes for updating data v */

// Route for updating a entry task
router.put('/update-entry-task/:id', (req, res) => {
  journalController.updateEntryTask(req, res);
});

// Route for updating a entry note
router.put('/update-entry-note/:id', (req, res) => {
  journalController.updateEntryNote(req, res);
});

// Route for updating a entry event
router.put('/update-entry-event/:id', (req, res) => {
  journalController.updateEntryEvent(req, res);
});

// Route for updating a term task
router.put('/update-term-task/:id', (req, res) => {
  journalController.updateTermTask(req, res);
});

// Route for updating a term note
router.put('/update-term-note/:id', (req, res) => {
  journalController.updateTermNote(req, res);
});

// Route for updating an term event
router.put('/update-term-event/:id', (req, res) => {
  journalController.updateTermEvent(req, res);
});

// Route for updating a collection note
router.put('/update-collection-note/:id', (req, res) => {
  journalController.updateCollectionNote(req, res);
});

// Route for updating a collection event
router.put('/update-collection-event/:id', (req, res) => {
  journalController.updateCollectionEvent(req, res);
});
/* ^^ Routes for updating data ^^ */

/* v Routes for deleting data v */

// Route for deleting a entry task
router.post('/delete-entry-task/:id', (req, res) => {
  journalController.deleteEntryTask(req, res);
});

// Route for deleting a entry note
router.post('/delete-entry-note/:id', (req, res) => {
  journalController.deleteEntryNote(req, res);
});

// Route for deleting a entry event
router.post('/delete-entry-event/:id', (req, res) => {
  journalController.deleteEntryEvent(req, res);
});

// Route for deleting a term task
router.post('/delete-term-task/:id', (req, res) => {
  journalController.deleteTermTask(req, res);
});

// Route for deleting a term note
router.post('/delete-term-note/:id', (req, res) => {
  journalController.deleteTermNote(req, res);
});

// Route for deleting a term event
router.post('/delete-term-event/:id', (req, res) => {
  journalController.deleteTermEvent(req, res);
});

// Route for deleting a collection note
router.post('/delete-collection-note/:id', (req, res) => {
  journalController.deleteCollectionNote(req, res);
});

// Route for deleting a collection event
router.post('/delete-collection-event/:id', (req, res) => {
  journalController.deleteCollectionEvent(req, res);
});
/* ^^ Routes for deleting data ^^ */

/* v Routes for moving data v */

// Route for moving entry task
router.put('/migrate-entry-task/:id', (req, res) => {
  journalController.migrateEntryTask(req, res);
});

// Route for moving entry note
router.put('/migrate-entry-note/:id', (req, res) => {
  journalController.migrateEntryNote(req, res);
});

// Route for moving entry event
router.put('/migrate-entry-event/:id', (req, res) => {
  journalController.migrateEntryEvent(req, res);
});

// Route for moving term task
router.put('/migrate-term-task/:id', (req, res) => {
  journalController.migrateTermTask(req, res);
});

// Route for moving term note
router.put('/migrate-term-note/:id', (req, res) => {
  journalController.migrateTermNote(req, res);
});

// Route for moving term event
router.put('/migrate-term-event/:id', (req, res) => {
  journalController.migrateTermEvent(req, res);
});
/* ^^ Routes for moving data ^^ */

export default router;
