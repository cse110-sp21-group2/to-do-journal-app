/* eslint-disable import/extensions */
/* eslint-disable no-undef */

import session from "../scripts/session.js";

class LeftNav extends HTMLElement {
    constructor() {
      super();

      const journal = session.getJournal();
      // templated HTML content
      const template = document.createElement('template');

      template.innerHTML = `
        <head>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
            integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
        </head>
		    <style>
            @font-face {
                font-family: 'Tw Cen MT Std Medium Cond';
                font-style: normal;
                font-weight: normal;
                src: local('Tw Cen MT Std Medium Cond'), url('../assets/TwCenMTStdMediumCond.woff') format('woff');
            }
            .logo {
                width: 180px;
                display: table;
                margin: 0 auto;
            }

            .navigation-title {
                /*block*/
                background-color: #E2CB14;
                margin: 0px -10px 0px -10px;
                padding: 10px;
                text-align: center;
                /*text*/
                font-family: 'Tw Cen MT Std Medium Cond';
                font-style: normal;
                font-weight: normal;
                font-size: 45px;
                color:#162A47;
            }

            .index-link, .collections-link{
                padding: 10px;
                margin: 10px -10px 10px -10px;
                text-align: center;
            }

            .collections-button{
                width: 40px;
                height: 40px;
                border-radius: 40px;
                background-color: white;
                border: solid;
                display: table;
                margin: 15px auto;
            }

            .link-text{
                text-decoration: none;
                font-family: 'Roboto', Condensed;
                font-style: normal;
                font-weight: 300;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: -0.02em;
                color: #162A47;
            }
            @keyframes logo_animate {
              from {transform: scale(1);}
              to {transform: scale(0.8);}
            }

            #logo{
              transform: scale(1);
              animation-name: logo_animate;
              animation-duration: 2s;
              animation-iteration-count: infinite;
              animation-direction: alternate;
              animation-timing-function: ease-in-out
            }
            .link-text:hover {
              opacity: 0.8;
              box-shadow: 0 3px 10px #E2CB14
            }
            #to-do-logo:hover {
              opacity: 0.8;
              box-shadow: 0 3px 10px #E2CB14
            }
		    </style>
        <a id="to-do-logo" href="/"><img id="logo" src="../assets/logo500.png" alt="Two-Do logo" class="logo" ></a>
        <a href="/index"><h1 class="navigation-title">Index</h1></a>
        <h2 class="index-link"><a href="/daily" class="link-text">Daily</a></h2>
        <h2 class="index-link"><a href="/weekly" class="link-text">Weekly</a></h2>
        <h2 class="index-link"><a href="/monthly" class="link-text">Monthly</a></h2>
        <h2 class="index-link"><a href="/term" class="link-text">Quarterly</a></h2>
        <br>
        <h1 class="navigation-title">Collections</h1>
        ${journal.collections.map((collection) =>
          `<h2 class="collections-link">
            <a href="/collections/?name=${collection.name}" class="link-text">
              ${collection.name}
            </a>
          </h2>`
          ).join('')}
        <create-collection-modal id="create-collection-component"></create-collection-modal>
        <button type="button" class="collections-button"><i class="fas fa-chevron-down"></i></button>
        `;

      // create a shadow root for this web component
      this.attachShadow({ mode: 'open' })
      // attach cloned content of template to shadow DOM
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

// Define, instantiate, and add the component to its respective div to the calling document
customElements.define('left-nav-component', LeftNav);
const comp = document.createElement('left-nav-component');
document.querySelector('.left-nav').appendChild(comp);
