const taskTemplate = document.createElement('template');
// Contain style and mark-up/structure of custom element
taskTemplate.innerHTML = `
    <style>

        .task {
            border: 2px solid black;
            width: 60%;
            height: 50px;
            float: left;
        }
        .task-content,
        .curr-date {
            margin-top: 1px;
        }

        .task,
        .date { 
            display: inline-block;
            margin-bottom: 2px;
        }

        .curr-date {
            font-size: 14px;
        }
        .date {
            border: 1px solid black;
            border-radius: 0px 20px 20px 0px;
            height: 50px;
            float: left;
            padding-left: 10px;
            padding-right: 10px;
        }
    </style>

    <div class="task">
        <p class="task-content"></p>
    </div>
    <div class="date">
        <p class="curr-date"></p>
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