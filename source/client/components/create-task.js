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
    <form action="/action_page.php" class="create-task">
        <h2 class="create-task-title"> Create a Tasks </h2>
        <div class="task-name-field">
            <label for="task-name"></label>
            <input type="text" id="task-name" name="task-name" placeholder="Task Name">
        </div>

        <div class="start-date-field">
            <label for="start-date">Start Date</label>
            <input id="start-date" type="date" name="start-date">
        </div>

        <div class="end-time-field">
            <label for="end-time">End Time</label>
            <input id="end-time" type="time" name="end-time"></input>
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

class createTask extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(createTaskTemplate.content.cloneNode(true));
    }
    /**
     * TODO:
     *      - Know when it's quarterly or semesterly(User Setting)
     *      - GET journal
     *      - GET entries (semester or quqarter)
     *      - Go through each entry to see if there exist an entry for current date
     *          - Make new entry otherwise based on date
     *      - In that entry, create new task
     */

    /**
     * Getter that gets the name/content of task
     */
    get getTaskContent(){
        console.log(document.querySelector('input#task-name').value);
        return document.querySelector('input#task-name').value;
    }

    /**
     * Getter that gets the start Date: MM/DD/YYYY
     */
    get getStartDate(){
        console.log(document.querySelector('input#start-date').value);
        return document.querySelector('input#task-name').value;
    }

    /**
     * Getter that gets the link
     */
    get getLink(){
        console.log(document.querySelector('input#link').value);
        return document.querySelector('input#link').value;
    }


    /**
     * Getter that gets the End Time 00:00 PM ? AM
     */
    get getTime() {
        console.log(document.querySelector('input#input-time').value);
        return document.querySelector('input#input-time').value;
    }
    
}



customElements.define('create-task', createTask);
const someTask = document.createElement('create-task');
document.querySelector('main.main').appendChild(someTask);