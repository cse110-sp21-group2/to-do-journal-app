const createTaskTemplate = document.createElement('template');
createTaskTemplate.innerHTML =`
    <style>
        form {
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

        .label-container {
            
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
    <form class="create-task">
        <h2 class="create-task-title"> Create a Tasks </h2>
        <div class="task-name-field">
            <label for="task-name"></label>
            <input type="text" id="task-name" name="task-name" placeholder="Task Name">
        </div>

        <div class="start-date-field">
            <label for="start-date">Start Date</label>
            <input id="start-date" type="date" name="start-date">
        </div>

        <div class="end-date-field">
            <label for="end-date">End Date</label>
            <input id="end-date" type="date" name="end-date"></input>
        </div>

        <div class="link-field">
            <label for="link"></label>
            <input type="url" id="link" name="link" placeholder="Link">
        </div>

        <div class="label-container">
            placeholder
        </div>

        <div class="buttons">
            <input type="submit" name="cancel" value="Cancel" class="cancel-button">
            <input type="submit" name="save" value="Save" class="save-button">
        </div>
    </form>
`
// Component for Creating a Task
class createTask extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(createTaskTemplate.content.cloneNode(true));
        
    }
    /**
     * TODO:
     *      - SET task content property value?
     *      - SET note content property value?
     *      - SET Link property value?
     *      - SET time property value?
     *      
     *      - GET task content
     *      - GET note content
     *      - GET Link
     *      - GET time
     *      
     */


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
        return this.shadowRoot.querySelector('input#start-date').value;
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

// in order to display it for scripting convenience, but wants to act as pop up when click btn
customElements.define('create-task', createTask);