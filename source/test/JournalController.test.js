import Journal from '../models/Journal';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../index';

chai.use(chaiHttp);

const should = chai.should();

const DAY_MULTIPLIER = 86400000;

// const id = mongoose.Types.ObjectId();
const id = '60a43dfc8fd553c9a3b4e1b8';
const _date = new Date();

let url;

let date;

let toDate;
let fromDate;

let entryDate;
let dueDate;
let type;

let migrateDate = new Date(_date.getTime() + DAY_MULTIPLIER);
let migrateWeekNumber;

let name;
let content;

let startTime;
let endTime;

let startDate;
let endDate;

let termId;
let weekNumber;

let collectionId;

let taskId;
let eventId;
let noteId;

describe('Journal', () => {
  /*
   * Test creating new journal
   */
  // describe('/POST journal', () => {
  //   it('it should POST a journal ', (done) => {
  //     url = `/api/create-journal/${id}`
  //     chai
  //       .request(server)
  //       .post(`/api/create-journal/${id}`)
  //       .end((err, res) => {
  //         res.should.have.status(201);
  //         res.body.should.have
  //           .property('success')
  //           .eql(true);
  //         res.body.data.should.be.a('object');
  //         res.body.data.should.have.property('_id');
  //         res.body.data.should.have.property('dailyEntries');
  //         res.body.data.should.have.property('weeklyEntries');
  //         res.body.data.should.have.property('quarterlyEntries');
  //         res.body.data.should.have.property('semesterlyEntries');
  //         res.body.data.should.have.property('collections');
  //         done();
  //       });
  //   });
  // });

  /*
   * Test getting a user journal.
   */
  describe('Test GET route /api/journal/:id', () => {
    it('It should GET a journal given the user id', (done) => {
      url = `/api/journal/${id}`;

      chai
        .request(server)
        .get(url)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('dailyEntries');
          res.body.data.should.have.property('weeklyEntries');
          res.body.data.should.have.property('quarterlyEntries');
          res.body.data.should.have.property('semesterlyEntries');
          res.body.data.should.have.property('collections');

          done();
        });
    });
  });

  /*
   * Test adding a new journal entry.
   */
  describe('Test POST route /api/add-journal-entry/:id', () => {
    it('It should ADD an entry to a journal', (done) => {
      url = `/api/add-journal-entry/${id}`;

      date = new Date(_date);
      type = 'Daily';

      const body = {
        type,
        date,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('tasks');
          res.body.data.should.have.property('events');
          res.body.data.should.have.property('notes');
          res.body.data.should.have.property('date');

          done();
        });
    });
  });

  /*
   * Test adding a new entry task.
   */
  describe('Test POST route /api/add-entry-task/:id', () => {
    it('It should ADD a task to an entry', (done) => {
      url = `/api/add-entry-task/${id}`;

      content = 'Test adding new entry task to first entry.';
      dueDate = new Date(date.getTime() + 2 * DAY_MULTIPLIER);

      entryDate = new Date(_date);

      const body = {
        content,
        dueDate,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('dueDate');

          taskId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test updating entry task.
   */
  describe('Test PUT route /api/update-entry-task/:id', () => {
    it('It should UPDATE task in entry', (done) => {
      url = `/api/update-entry-task/${id}`;

      content = 'Test updating task in first entry';
      dueDate = new Date(_date.getTime() + 3 * DAY_MULTIPLIER);

      const body = {
        taskId,
        content,
        dueDate,
        entryDate,
        type,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('dueDate');

          done();
        });
    });
  });

  /*
   * Test deleting entry task.
   */
  describe('Test POST route /api/delete-entry-task/:id', () => {
    it('It should DELETE a task from an entry', (done) => {
      url = `/api/delete-entry-task/${id}`;

      const body = {
        taskId,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);

          done();
        });
    });
  });

  /*
   * Test adding a new entry event.
   */
  describe('Test POST route /api/add-entry-event/:id', () => {
    it('It should ADD an entry event', (done) => {
      url = `/api/add-entry-event/${id}`;

      content = 'Test adding new entry event';

      startTime = new Date(_date);
      endTime = new Date(_date.getTime());

      type = 'Daily';

      const body = {
        content,
        startTime,
        endTime,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');

          eventId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test updating a entry event.
   */
  describe('Test POST route /api/update-entry-event/:id', () => {
    it('It should UPDATE an entry event', (done) => {
      url = `/api/update-entry-event/${id}`;

      content = 'Test updating event in first entry';

      type = 'Daily';

      const body = {
        content,
        eventId,
        startTime,
        endTime,
        entryDate,
        type,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');

          done();
        });
    });
  });

  /*
   * Test deleting an entry event.
   */
  describe('Test POST route /api/delete-entry-event/:id', () => {
    it('It should DELETE an entry event', (done) => {
      url = `/api/delete-entry-event/${id}`;

      type = 'Daily';

      const body = {
        eventId,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    });
  });

  /*
   * Test adding a new entry note.
   */
  describe('Test POST route /api/add-entry-note/:id', () => {
    it('It should ADD a entry note', (done) => {
      url = `/api/add-entry-note/${id}`;

      content = 'Test adding new note to first entry';
      type = 'Daily';

      const body = {
        content,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');

          noteId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test updating a entry note.
   */
  describe('Test POST route /api/update-entry-note/:id', () => {
    it('It should UPDATE a entry note', (done) => {
      url = `/api/update-entry-note/${id}`;

      content = 'Test updating note in first entry';

      type = 'Daily';

      const body = {
        noteId,
        content,
        entryDate,
        type,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          done();
        });
    });
  });

  /*
   * Test deleting a entry note.
   */
  describe('Test POST route /api/delete-entry-note/:id', () => {
    it('It should DELETE an entry note', (done) => {
      url = `/api/delete-entry-note/${id}`;

      date = new Date(_date);
      type = 'Daily';

      const body = {
        noteId,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    });
  });

  /*
   * Test adding a new journal entry.
   */
  describe('Test POST route /api/add-journal-entry/:id', () => {
    it('It should ADD an entry to a journal', (done) => {
      url = `/api/add-journal-entry/${id}`;

      date = new Date(_date.getTime() + DAY_MULTIPLIER);
      type = 'Daily';

      const body = {
        type,
        date,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('tasks');
          res.body.data.should.have.property('events');
          res.body.data.should.have.property('notes');
          res.body.data.should.have.property('date');
          done();
        });
    });
  });

  /*
   * Test adding a new journal entry.
   */
  describe('Test POST route /api/add-journal-entry/:id', () => {
    it('It should ADD an entry to a journal', (done) => {
      url = `/api/add-journal-entry/${id}`;
      date = new Date(_date.getTime() + 2 * DAY_MULTIPLIER);

      type = 'Daily';

      const body = {
        type,
        date,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('tasks');
          res.body.data.should.have.property('events');
          res.body.data.should.have.property('notes');
          res.body.data.should.have.property('date');
          done();
        });
    });
  });

  /*
   * Test getting journal entry.
   */
  describe('Test GET route /api/journal-entry/:id&:date&:type', () => {
    it('It should GET a journal entry', (done) => {
      url = `/api/journal-entry/${id}&${date}&${type}`;

      const body = {
        date,
        type,
      };

      chai
        .request(server)
        .get(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('tasks');
          res.body.data.should.have.property('events');
          res.body.data.should.have.property('notes');
          res.body.data.should.have.property('date');
          done();
        });
    });
  });

  /*
   * Test getting journal entries.
   */
  describe('Test GET route /api/journal-entries/:id&:fromDate&:toDate&:type', () => {
    it('It should GET a range of journal entries', (done) => {
      fromDate = new Date(_date);
      toDate = date;

      url = `/api/journal-entries/${id}&${fromDate}&${toDate}&${type}`;

      const body = {
        fromDate,
        toDate,
        type,
      };

      chai
        .request(server)
        .get(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('array');
          res.body.data[0].should.have.property('_id');
          res.body.data[0].should.have.property('tasks');
          res.body.data[0].should.have.property('events');
          res.body.data[0].should.have.property('notes');
          res.body.data[0].should.have.property('date');
          done();
        });
    });
  });

  /*
   * Test adding a new entry task.
   */
  describe('Test POST route /api/add-entry-task/:id', () => {
    it('It should ADD a task to an entry', (done) => {
      url = `/api/add-entry-task/${id}`;

      content = 'Test adding new entry task to first entry.';
      dueDate = new Date(date.getTime() + 2 * DAY_MULTIPLIER);

      entryDate = new Date(_date);

      const body = {
        content,
        dueDate,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('dueDate');

          taskId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test adding a new entry event.
   */
  describe('Test POST route /api/add-entry-event/:id', () => {
    it('It should ADD an entry event', (done) => {
      url = `/api/add-entry-event/${id}`;

      content = 'Test adding new entry event';

      startTime = new Date(_date);
      endTime = new Date(_date.getTime());

      type = 'Daily';

      const body = {
        content,
        startTime,
        endTime,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');

          eventId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test adding a new entry note.
   */
  describe('Test POST route /api/add-entry-note/:id', () => {
    it('It should ADD a entry note', (done) => {
      url = `/api/add-entry-note/${id}`;

      content = 'Test adding new note to first entry';
      type = 'Daily';

      const body = {
        content,
        entryDate,
        type,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');

          noteId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test migrating an entry task.
   */
  describe('Test PUT route /api/migrate-entry-task/:id', () => {
    it('It should move a task to another journal entry', (done) => {
      url = `/api/migrate-entry-task/${id}`;

      const body = {
        taskId,
        entryDate,
        migrateDate,
        type,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('dueDate');
          done();
        });
    });
  });

  /*
   * Test migrating an entry event.
   */
  describe('Test PUT route /api/migrate-entry-event/:id', () => {
    it('It should move an event to another journal entry', (done) => {
      url = `/api/migrate-entry-event/${id}`;
      name = 'Test Journal Collection';

      const body = {
        eventId,
        entryDate,
        migrateDate,
        type,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');
          done();
        });
    });
  });

  /*
   * Test migrating a entry note.
   */
  describe('Test PUT route /api/migrate-entry-note/:id', () => {
    it('It should move a note to another journal entry', (done) => {
      url = `/api/migrate-entry-note/${id}`;

      const body = {
        noteId,
        entryDate,
        migrateDate,
        type,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          done();
        });
    });
  });

  /*
   * Test adding a new journal term.
   */
  describe('Test POST route /api/add-journal-term/:id', () => {
    it('It should ADD a new term to a journal', (done) => {
      url = `/api/add-journal-term/${id}`;

      startDate = new Date(_date);
      endDate = new Date(startDate.getTime() + 80 * 86400000);
      type = 'Quarter';

      const body = {
        type,
        startDate,
        endDate,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('weeks');
          res.body.data.should.have.property('startDate');
          res.body.data.should.have.property('endDate');

          termId = res.body.data._id;
          weekNumber = 3;

          done();
        });
    });
  });

  /*
   * Test adding a new term task.
   */
  describe('Test POST route /api/add-term-task/:id', () => {
    it('It should ADD a task to a term', (done) => {
      url = `/api/add-term-task/${id}`;

      content = 'Test adding new task to first term.';
      dueDate = new Date(startDate.getTime() + 2 * DAY_MULTIPLIER);
      weekNumber = 3;

      const body = {
        content,
        dueDate,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('dueDate');

          taskId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test updating term task.
   */
  describe('Test PUT route /api/update-term-task/:id', () => {
    it('It should UPDATE task in term', (done) => {
      url = `/api/update-term-task/${id}`;

      content = 'Test updating task in first term, week 4.';
      dueDate = new Date(startDate.getTime() + 2 * DAY_MULTIPLIER);

      const body = {
        taskId,
        content,
        dueDate,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('dueDate');

          done();
        });
    });
  });

  /*
   * Test deleting a term task.
   */
  describe('Test POST route /api/delete-term-task/:id', () => {
    it('It should DELETE a task from a term', (done) => {
      url = `/api/delete-term-task/${id}`;

      content = 'Test deleting task in first term, week 4.';

      const body = {
        taskId,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);

          done();
        });
    });
  });

  /*
   * Test adding a new term event.
   */
  describe('Test POST route /api/add-term-event/:id', () => {
    it('It should ADD a term event', (done) => {
      url = `/api/add-term-event/${id}`;

      content = 'Test adding new event to first term';

      startTime = new Date(_date);
      endTime = new Date(_date.getTime());

      const body = {
        content,
        startTime,
        endTime,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');

          eventId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test updating a term event.
   */
  describe('Test PUT route /api/update-term-event/:id', () => {
    it('It should UPDATE a term event', (done) => {
      url = `/api/update-term-event/${id}`;

      content = 'Test updating new event in first term, week 4';

      const body = {
        eventId,
        content,
        startTime,
        endTime,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');

          done();
        });
    });
  });

  /*
   * Test deleting a term event.
   */
  describe('Test POST route /api/delete-term-event/:id', () => {
    it('It should DELETE a term event', (done) => {
      url = `/api/delete-term-event/${id}`;

      const body = {
        eventId,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    });
  });

  /*
   * Test adding a new term note.
   */
  describe('Test POST route /api/add-term-note/:id', () => {
    it('It should ADD a term note', (done) => {
      url = `/api/add-term-note/${id}`;

      content = 'Test adding new note to first term, week 4';

      const body = {
        content,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');

          noteId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test updating a term note.
   */
  describe('Test POST route /api/update-term-note/:id', () => {
    it('It should UPDATE a term note', (done) => {
      url = `/api/update-term-note/${id}`;

      content = 'Test updating note in first term, week 4';

      const body = {
        noteId,
        content,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          done();
        });
    });
  });

  /*
   * Test deleting a term note.
   */
  describe('Test POST route /api/delete-term-note/:id', () => {
    it('It should DELETE a term note', (done) => {
      url = `/api/delete-term-note/${id}`;

      const body = {
        noteId,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    });
  });

  /*
   * Test adding a new term task.
   */
  describe('Test POST route /api/add-term-task/:id', () => {
    it('It should ADD a task to a term', (done) => {
      url = `/api/add-term-task/${id}`;

      content = 'Test adding new task to first term.';
      dueDate = new Date(startDate.getTime() + 2 * DAY_MULTIPLIER);

      const body = {
        content,
        dueDate,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('dueDate');

          taskId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test adding a new term event.
   */
  describe('Test POST route /api/add-term-event/:id', () => {
    it('It should ADD a term event', (done) => {
      url = `/api/add-term-event/${id}`;

      content = 'Test adding new event to first term';

      startTime = new Date(_date);
      endTime = new Date(_date.getTime());

      const body = {
        content,
        startTime,
        endTime,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');

          eventId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test adding a new term note.
   */
  describe('Test POST route /api/add-term-note/:id', () => {
    it('It should ADD a term note', (done) => {
      url = `/api/add-term-note/${id}`;

      content = 'Test adding new note to first term, week 4';
      type = 'Daily';

      const body = {
        content,
        termId,
        weekNumber,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');

          noteId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test migrating a term task.
   */
  describe('Test PUT route /api/migrate-term-task/:id', () => {
    it('It should move a task to another week within a term', (done) => {
      url = `/api/migrate-term-task/${id}`;

      migrateWeekNumber = 5;

      const body = {
        taskId,
        termId,
        weekNumber,
        migrateWeekNumber,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('dueDate');
          done();
        });
    });
  });

  /*
   * Test migrating a term event.
   */
  describe('Test PUT route /api/migrate-term-event/:id', () => {
    it('It should move an event to another week within a term', (done) => {
      url = `/api/migrate-term-event/${id}`;
      name = 'Test Journal Collection';

      const body = {
        eventId,
        termId,
        weekNumber,
        migrateWeekNumber,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');
          done();
        });
    });
  });

  /*
   * Test migrating a term note.
   */
  describe('Test PUT route /api/migrate-term-note/:id', () => {
    it('It should move a note to another week within a term', (done) => {
      url = `/api/migrate-term-note/${id}`;

      const body = {
        noteId,
        termId,
        weekNumber,
        migrateWeekNumber,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          done();
        });
    });
  });

  /*
   * Test getting journal term.
   */
  describe('Test GET route /api/journal-term/:id&:date', () => {
    it('It should GET a journal term', (done) => {
      url = `/api/journal-term/${id}&${date}`;

      chai
        .request(server)
        .get(url)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('weeks');
          res.body.data.should.have.property('startDate');
          res.body.data.should.have.property('endDate');
          done();
        });
    });
  });

  /*
   * Test adding a new journal collection.
   */
  describe('Test POST route /api/add-journal-collection/:id', () => {
    it('It should ADD a new journal collection', (done) => {
      url = `/api/add-journal-collection/${id}`;

      name = 'New Collection';

      const body = {
        name,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('events');
          res.body.data.should.have.property('notes');

          collectionId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test adding a new collection event.
   */
  describe('Test POST route /api/add-collection-event/:id', () => {
    it('It should ADD a collection event', (done) => {
      url = `/api/add-collection-event/${id}`;

      content = 'Test adding new event to first collection';

      startTime = new Date(_date);
      endTime = new Date(_date.getTime());

      const body = {
        content,
        startTime,
        endTime,
        collectionId,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');

          eventId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test updating a collection event.
   */
  describe('Test PUT route /api/update-collection-event/:id', () => {
    it('It should UPDATE a collection event', (done) => {
      url = `/api/update-collection-event/${id}`;

      content = 'Test updating new event in first collection';

      const body = {
        eventId,
        content,
        startTime,
        endTime,
        collectionId,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          res.body.data.should.have.property('startTime');
          res.body.data.should.have.property('endTime');

          done();
        });
    });
  });

  /*
   * Test deleting a collection event.
   */
  describe('Test POST route /api/delete-collection-event/:id', () => {
    it('It should DELETE a collection event', (done) => {
      url = `/api/delete-collection-event/${id}`;

      const body = {
        eventId,
        collectionId,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    });
  });

  /*
   * Test adding a new collection note.
   */
  describe('Test POST route /api/add-collection-note/:id', () => {
    it('It should ADD a collection note', (done) => {
      url = `/api/add-collection-note/${id}`;

      content = 'Test adding new note to first collection';

      const body = {
        content,
        collectionId,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');

          noteId = res.body.data._id;

          done();
        });
    });
  });

  /*
   * Test updating a collection note.
   */
  describe('Test POST route /api/update-collection-note/:id', () => {
    it('It should UPDATE a collection note', (done) => {
      url = `/api/update-collection-note/${id}`;

      content = 'Test updating note in first collection';

      const body = {
        noteId,
        content,
        collectionId,
      };

      chai
        .request(server)
        .put(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('content');
          done();
        });
    });
  });

  /*
   * Test deleting a collection note.
   */
  describe('Test POST route /api/delete-collection-note/:id', () => {
    it('It should DELETE a collection note', (done) => {
      url = `/api/delete-collection-note/${id}`;

      const body = {
        noteId,
        collectionId,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    });
  });

  /*
   * Test getting journal collection.
   */
  describe('Test GET route /api/journal-entry/:id&:date&:type', () => {
    it('It should GET a journal collection', (done) => {
      url = `/api/journal-collection/${id}&${collectionId}`;

      chai
        .request(server)
        .get(url)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('tasks');
          res.body.data.should.have.property('events');
          res.body.data.should.have.property('notes');
          done();
        });
    });
  });
});
