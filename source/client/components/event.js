/* eslint-disable no-useless-escape */
const eventTemplate = document.createElement('template');
// Contain style and mark-up/structure of custom element
eventTemplate.innerHTML = `
    <style>

        .event-grid {
            display: grid;
            grid-template-columns: 3fr 4fr;
            grid-template-rows: auto;
            margin: 5px;
            width: 90%;
        }
        .time {
            width: 100%;
            height: 100%;
            background-color: #43748A;
            color: white;
            display: table;
        }
        .event-time {
            line-height: 1.5;
            font-family: "Roboto";
            font-size: 14px;
            text-align: center;
            vertical-align: middle;
            display: table-cell;
            padding: 10px;
        }
        .event {
            width: 100%;
            height: 100%;
            border: 2px solid #43748A;
            display: table;
        }
        .event-content {
            line-height: 1.5;
            font-family: "Roboto";
            font-size: 14px;
            font-weight: 400;
            text-align: center;
            vertical-align: middle;
            display: table-cell;
            padding: 10px;
        }

    </style>
    
    <div class="event-grid">
        <div class="time">
            <p class="event-time"></p>
        </div>
        <div class="event">
            <p class="event-content"></p>
        </div>
    </div>
`;
// 'event-toggle' component
class Events extends HTMLElement{
    constructor(){
    super()

    // Create shadowRoot for webcomponent
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(eventTemplate.content.cloneNode(true));
    }

    /**
     * SET content property of 'event-toggle' element/object
     * and put it in HTML
     *
     * @params event - event object that contains event properties
     */
    set content(event) {
        this.shadowRoot.querySelector('p.event-content').innerHTML = JSON.stringify(event.content).replace(/"/g, "");
    }

    /**
     * SET startTime property of 'event-toggle' element/object
     * and put it in HTML
     *
     * @params date - date object stored in event object
     */
    set startTime(date) {
        const hour = date.getHours() % 12;
        const minute = date.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        this.shadowRoot.querySelector("p.event-time").innerHTML = `${hour}:${minute}${ampm} - `;
    }

    /**
     * SET endTime property of 'event-toggle' element/object
     * and put it in HTML
     *
     * @params date - date object stored in event object
     */
    set endTime(date) {
        const hour = date.getHours() % 12;
        const minute = date.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const startHTML = this.shadowRoot.querySelector('p.event-time').innerHTML;
        this.shadowRoot.querySelector('p.event-time').innerHTML =  `${startHTML}${hour}:${minute}${ampm}`
    }
}

customElements.define('event-toggle', Events);
