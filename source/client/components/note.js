const noteTemplate = document.createElement('template');
// Contain style and mark-up/structure of custom element
noteTemplate.innerHTML = `
    <style>
        .note {
            border: 2px solid black;
        }
    </style>
    <div class="note">
        <p class="note-content"></p>
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
        this.shadowRoot.querySelector('p.note-content').innerHTML = `**BULLET POINT** ${JSON.stringify(note.content).replace(/"/g, "")}`;
    }
}

customElements.define('note-toggle', Notes);