/* eslint-disable no-undef */

class AccountBar extends HTMLElement{
    constructor(){
        super();
        const template = document.createElement('template');

        template.innerHTML = `
        <style>
            .help-button, .notification-button, .account-button {
                background-color: #ffffff;
                width: 40px;
                height: 40px;
                border-radius: 40px;
            }
        </style>

            <button type="button" class="help-button"></button>
            <button type="button" class="notification-button"></button>
            <button type="button" class="account-button"></button>
        `;
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('account-bar', AccountBar);
