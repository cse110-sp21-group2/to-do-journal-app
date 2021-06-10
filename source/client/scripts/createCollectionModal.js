/* eslint-disable import/extensions */
/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import journalAPI from '../api/journalAPI.js';
import session from './session.js';

const user = session.getUser();
const journal = session.getJournal();

window.addEventListener('DOMContentLoaded', async () => {
  // Get Left Nav node component
  const leftNav = document.querySelector('.left-nav').childNodes[0];
  // Use Left Nav Shadow Root to get create collection component
  const createCollection = leftNav.shadowRoot.getElementById(
    'create-collection-component'
  );
  // Get modal
  const modal = createCollection.shadowRoot.querySelector('.modal');

  // Get button for opening modal
  const modalButton = createCollection.shadowRoot.getElementById('modal-opener');

  // Get modal save button
  const saveButton = createCollection.shadowRoot.querySelector('.save-btn');

  // Get modal input
  const collectionNameInput = createCollection.shadowRoot.getElementById('name');

  // When user clicks submit button
  saveButton.onclick = async () => {
    // Get inputted name
    const { value: collectionName } = collectionNameInput;

    // If user input a name
    if (collectionName) {
      // Construct payload with new collection name
      // and user id
      const payload = {
        name: collectionName,
        id: user._id,
      };

      // Add new collection
      const { success, data: newCollection } = await journalAPI.addJournalCollection(
        payload
      );

      // If successful
      if (success) {
        // Push new collection to session journal
        journal.collections.push(newCollection);
        // Set new updated session journal
        session.setJournal(journal);

        // Redirect user to collection page
        window.location.href = `/collections/?name=${collectionName}`;
        // Else something went wrong
      } else {
        alert('Sopmething went wrong. Please try again');
      }
      // Else user hasn't input a name yet
    } else {
      alert('You must enter a name for your collection');
    }
  };

  // Attach listeners for when  user clicks exit button
  // or anywhere outside of modal content
  function attachModalListeners(modalElm) {
    modalElm.querySelector('.close-modal').addEventListener('click', toggleModal);
    modalElm.querySelector('.overlay').addEventListener('click', toggleModal);
  }

  // Modal is being closed, remove all event listeners
  function detachModalListeners(modalElm) {
    modalElm.querySelector('.close-modal').removeEventListener('click', toggleModal);
    modalElm.querySelector('.overlay').removeEventListener('click', toggleModal);
  }

  // Handle toggle of modal based on status of display
  function toggleModal() {
    // Get display of current modal
    const currentState = modal.style.display;
    // If modal is visible, hide it. Else, display it.
    if (currentState === 'none') {
      modal.style.display = 'block';
      attachModalListeners(modal);
    } else {
      modal.style.display = 'none';
      detachModalListeners(modal);
    }
  }

  // Listening for when user wants to add new collection
  modalButton.onclick = async () => {
    toggleModal();
  };
});
