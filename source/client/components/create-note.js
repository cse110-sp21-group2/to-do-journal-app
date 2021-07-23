class createNote extends HTMLElement {
    constructor() {
        super();

        // templated HTML content
        const createNoteTemplate = document.createElement('template');

        createNoteTemplate.innerHTML = `
            <style>
                h1 {
                    font-family: Unica One;
                    font-style: normal;
                    font-weight: normal;
                }
                form {
                    display: grid;
                    width: 500px;
                    height: 700px;
                    font-family: Roboto Condensed;
                    font-style: normal;
                    font-weight: normal;
                    color: rgba(22, 42, 71, 0.75);
                    padding: 30px;
                    background-color: white;
                    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.25);
                    border-radius: 15px;
                }
                textarea {
                    border: 1px solid #162a47;
                    border-radius: 5px;
                    white-space: pre-wrap;
                }
                .note-content-field {
                    font-family: Roboto Condensed;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 36px;
                    color: rgba(22, 42, 71, 0.75);
                    white-space: pre-wrap;
                }
                .cancel-button {
                    width: 91.19px;
                    height: 32.83px;
                    font-family: Roboto Condensed;
                    font-style: normal;
                    font-weight: normal;
                    border: solid #834900 1px;
                    background: white;
                    color: #834900;
                    cursor: pointer;
                }
                .save-button {
                    font-family: Roboto Condensed;
                    font-style: normal;
                    font-weight: normal;
                    border: none;
                    background: #C69000;
                    color: white;
                    width: 182.39px;
                    height: 53.9px;
                    border-radius: 10px;
                }
                .save-button:hover {
                    background-color: #DCBB0E;
                    cursor: pointer;
                }
            </style>
            <form class="create-note">
                <h1 class="create-note-title"> Add a Note</h1>
                <div class="note-content-field">
                    <textarea id="note-content" name="note-content" rows="25" cols="50"></textarea>
                </div>
                <div class="buttons">
                    <input type="submit" name="cancel" value="Cancel" class="cancel-button">
                    <input type="button" name="save" value="Save" class="save-button">
                </div>
            </form>
        `;

        // create a shadow root for this web component
        this.attachShadow({ mode: 'open' })
        // attach cloned content of template to shadow DOM
        this.shadowRoot.appendChild(createNoteTemplate.content.cloneNode(true))

    }

    /**
     * Getter that gets the content of a note
     */
    get getNoteContent() {
        return this.shadowRoot.querySelector('#note-content').value;
    }

    /**
     * Returns the submit button 
     */
    get submitBtn() {
        return this.shadowRoot.querySelector(".save-button");
    }
}

// Define, instantiate, and add the component to its respective div to the calling document
customElements.define('create-note', createNote);