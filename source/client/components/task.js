/* eslint-disable no-useless-escape */
const taskTemplate = document.createElement('template');
// Contain style and mark-up/structure of custom element
taskTemplate.innerHTML = `
    <style>
        .task-grid {
            display: grid;
            grid-template-columns: 1.5fr 8fr 2fr;
            grid-template-rows: auto;
            width: 90%;
            margin: 5px;
        }

        .task-icon {
            background-color: #00649c;
            width: 100%;
            height: 100%;
            border-radius: 30px 0px 0px 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .inner-icon {
            width: 8px;
            height: 8px;
            border-radius: 8px;
            background-color: white;
        }
        .task {
            border: 1px solid black;
            width: 100%;
            height: 100%;
            display: table;
        }

        .task-content {
            line-height: 1.5;
            font-family: "Roboto";
            font-size: 18px;
            text-align: center;
            vertical-align: middle;
            display: table-cell;
            padding: 10px;
        }
        .date {
            width: 100%;
            height: 100%;
            display: table;
            background-color: #d5ab09;
            border-radius: 0px 30px 30px 0px;
            line-height: 1.5;
            font-family: "Roboto";
        }
        .curr-date {
            font-size: 12px;
            color: white;
            margin: 5px;
            text-align: center;
            vertical-align: middle;
            display: table-cell;
            padding: 10px;
        }
        

    </style>
    <div class="task-grid">
        <div class="task-icon">
            <div class="inner-icon">
            </div>
        </div>
        <div class="task">
            <p class="task-content"></p>
        </div>
        <div class="date">
            <p class="curr-date"></p>
        </div>
    </div>
`;

// 'task-toggle' component
class Task extends HTMLElement {
    constructor(){
    super();

    // Create a shadow root for this web component
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(taskTemplate.content.cloneNode(true));
    }

    /**
     * SET task property of 'event-toggle' element/object
     * and put it in HTML
     *
     * @params task - task object that contains task properties
     */
    set content(task){
        this.shadowRoot.querySelector('p.task-content').innerHTML = JSON.stringify(task.content).replace(/"/g, "");
    }

    /**
     * SET date property of 'event-toggle' element/object
     * and put it in HTML
     *
     * @params date - date object in task object
     */
    set date(date){
        const hour = date.getHours()%12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const minute = date.getMinutes();
        const month = date.getMonth();
        const day = date.getDate();
        this.shadowRoot.querySelector('p.curr-date').innerHTML = `by ${month}/${day}, ${hour}:${minute}${ampm}`;
    }
}

customElements.define('task-toggle', Task);
