class createEvent extends HTMLElement {
    constructor() {
        super();

        // templated HTML content
        const createEventTemplate = document.createElement('template');

        createEventTemplate.innerHTML = `
            <style>
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
                .event-name-field {
                    font-family: Roboto Condensed;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 36px;
                    color: rgba(22, 42, 71, 0.75);
                }
                .start-date-field,
                end-time-field,
                link-field {
                    font-family: Roboto Condensed;
                    font-style: normal;
                    font-weight: normal;
                    color: rgba(22, 42, 71, 0.75);
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
        <form class="create-event">
            <h2 class="create-event-title"> Create an Event</h2>
            <div class="event-name-field">
                <label for="event-name"></label>
                <input type="text" id="event-name" name="event-name" placeholder="Event Name">
            </div>
                <div class="start-time-field">
                    <label for="start-time">Start Time</label>
                    <input id="start-time" type="time" name="start-time">
                </div>
                <div class="end-time-field">
                    <label for="end-time">End Time</label>
                    <input id="end-time" type="time" name="end-time"></input>
                </div>
                <div class="link-field">
                    <label for="link"></label>
                    <input type="url" id="link" name="link" placeholder="Link">
                </div>
                <div class="buttons">
                    <input type="submit" name="cancel" value="Cancel" class="cancel-button">
                    <input type="submit" name="save" value="Save" class="save-button">
                </div>
            </form>
        `;

        // create a shadow root for this web component
        this.attachShadow({ mode: 'open' })
        // attach cloned content of template to shadow DOM
        this.shadowRoot.appendChild(createEventTemplate.content.cloneNode(true))

    }

    /**
 * Getter that gets the name/content of event
 */
    get getEventContent() {
        return this.shadowRoot.querySelector('input#event-name').value;
    }

    /**
     * Getter that gets the start time: 00:00 PM ? AM
     */
    get getStartTime(){
        return this.shadowRoot.querySelector('input#start-time').value;
    }

    /**
     * Getter that gets the link
     */
    get getLink() {
        return this.shadowRoot.querySelector('input#link').value;
    }

    /**
     * Getter that gets the End Time 00:00 PM ? AM
     */
    get getEndTime() {
        return this.shadowRoot.querySelector('input#end-time').value;
    }

    /**
     * Returns the submit button 
     */
    get submitBtn() {
        return this.shadowRoot.querySelector("input.save-button");
    }
}

// Define, instantiate, and add the component to its respective div to the calling document
customElements.define('create-event', createEvent);