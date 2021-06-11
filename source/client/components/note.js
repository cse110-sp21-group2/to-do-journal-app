/* eslint-disable no-useless-escape */
const noteTemplate = document.createElement('template');
// Contain style and mark-up/structure of custom element
noteTemplate.innerHTML = `
    <style>
        .note {
            margin: 5px;
            display: grid;
            grid-template-rows: auto;
            grid-template-columns: 15px auto;
        }
        .bullet {
            margin-top: 4px;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            background-color: #162a47;
        }
        .note-container {
            display: table;
        }
        .note-content {
            display: table-cell;
            white-space: pre-line;
            text-align: left;
            vertical-align: middle;
            font-family: "Roboto";
            font-size: 18px;
            line-height: 1;
        }
    </style>
    <div class="note">
        <div class="bullet"></div>
        <div class="note-container">
            <p class="note-content"></p>
        </div>
    </div>
`
// 'note-toggle' component
class Notes extends HTMLElement {
    constructor(){
        super();

        // Create shadowRoot for web component
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(noteTemplate.content.cloneNode(true));
    }

    /**
     * SET content property of 'note-toggle' element/object
     * and put it in HTML
     *
     * @params note - note object that contains note properties
     */
    set content(note){
        this.shadowRoot.querySelector('p.note-content').innerHTML = `${JSON.stringify(note.content).replace(/"/g, "")}`;
    }
}

customElements.define('note-toggle', Notes);
