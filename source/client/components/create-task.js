
class createTask extends HTMLElement {
    constructor() {
        super();

        // templated HTML content
        const createTaskTemplate = document.createElement('template');

        createTaskTemplate.innerHTML = `
            <style>
                form {
                    display: grid;

                    font-family: Roboto Condensed;
                    font-style: normal;
                    font-weight: normal;
                    color: rgba(22, 42, 71, 0.75);
                    padding: 30px;
                    background-color: white;
                    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.25);
                    border-radius: 15px;
                }

                .task-name-field {
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
            <form action="/action_page.php" class="create-task">
                <h2 class="create-task-title"> Create a Task</h2>
                <div class="task-name-field">
                    <label for="task-name"></label>
                    <input type="text" id="task-name" name="task-name" placeholder="Task Name">
                </div>

                <div class="end-date-field">
                    <label for="end-date">End Date</label>
                    <input id="end-date" type="date" name="end-date">
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
        this.shadowRoot.appendChild(createTaskTemplate.content.cloneNode(true));


        /**
         * Getter that gets the name/content of task
         */
        get getTaskContent(){
            return this.shadowRoot.querySelector('input#task-name').value;
        }

        /**
         * Getter that gets the start Date: MM/DD/YYYY
         */
        get getStartDate(){
            return this.shadowRoot.querySelector('input#task-name').value;
        }

        /**
         * Getter that gets the link
         */
        get getLink(){
            return this.shadowRoot.querySelector('input#link').value;
        }

        /**
         * Getter that gets the End Time 00:00 PM ? AM
         */
        get getEndDate() {
            return this.shadowRoot.querySelector('input#end-date').value;
        }

        /**
         * Returns the submit button 
         */
        get submitBtn() {
            return this.shadowRoot.querySelector("input.save-button");
        }

    }

    // Define, instantiate, and add the component to its respective div to the calling document
    customElements.define('create-task', createTask);
    const comp = document.createElement('create-task');
    document.querySelector('.overlay').appendChild(comp);

    // customElements.define('create-task', createTask);
    // const someTask = document.createElement('create-task');
    // document.querySelector('main.main').appendChild(someTask);
    // in order to display it for scripting convenience, but wants to act as pop up when click btn
    // customElements.define('create-task', createTask);
