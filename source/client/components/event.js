const eventTemplate = document.createElement('template');
// Contain style and mark-up/structure of custom element
eventTemplate.innerHTML = `
    <style>

        .time {
            border: 2px solid black;
            float: left;
        }

        .event {
            border: 2px solid black;
        }
        .event-content{
            text-align: center;
        }
    </style>

    <div class="time">
        <p class="event-time"></p>
    </div>
    <div class="event">
        <p class="event-content"></p>
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