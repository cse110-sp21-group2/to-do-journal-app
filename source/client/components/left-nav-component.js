/* eslint-disable no-undef */

class LeftNav extends HTMLElement {
    constructor() {
      super();
  
      // templated HTML content
      const template = document.createElement('template');
  
      template.innerHTML = `
        <head>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
            integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
        </head>
		    <style>
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
                font-family: Tw Cen MT Condensed;
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
                margin: 0 auto;
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
		    </style>
        <img src="../../../admin/branding/logo500.png" alt="Two-Do logo" class="logo">
        <h1 class="navigation-title">Index</h1>
        <h2 class="index-link"><a href="" class="link-text">Daily</a></h2>
        <h2 class="index-link"><a href="" class="link-text">Weekly</a></h2>
        <h2 class="index-link"><a href="" class="link-text">Monthly</a></h2>
        <h2 class="index-link"><a href="" class="link-text">Quarterly</a></h2>
        <br>
        <h1 class="navigation-title">Collections</h1>
        <h2 class="collections-link"><a href="" class="link-text">Grocery List</a></h2>
        <h2 class="collections-link"><a href="" class="link-text">Bucket List</a></h2>
        <h2 class="collections-link"><a href="" class="link-text">Finance Planner</a></h2>
        <h2 class="collections-link"><a href="" class="link-text">Fitness Planner</a></h2>
        <h2 class="collections-link"><a href="" class="link-text">Reading Collection</a></h2>
        <button type="button" class="collections-button"><i class="fas fa-chevron-down"></i></button>
        `;
    
      // create a shadow root for this web component
      this.attachShadow({ mode: 'open' })
      // attach cloned content of template to shadow DOM 
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  
}
  
// Define, instantiate, and add the component to its respective div to the calling document
document.customElements.define('left-nav-component', LeftNav);
const comp = document.createElement('left-nav-component');
document.querySelector('.left-nav').appendChild(comp);
