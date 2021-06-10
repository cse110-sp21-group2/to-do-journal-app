/* eslint-disable import/extensions */
/* eslint-disable no-undef */

const modalTemplate = document.createElement('template');

modalTemplate.innerHTML = `
  <head>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
  </head>
  <style>
    #modal-opener {
      background: #fff;
      border: none;
      text-decoration: none;
      font-family: 'Roboto', Condensed;
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      letter-spacing: -0.02em;
      color: #162A47;
      margin-bottom: 20px;
    }

    #modal-opener:hover {
      cursor: pointer;
    }

    #modal-opener::after {
      content: "";
      display: block;
      left: 50%;
      width: 100%;
      height: 10%;
      border-radius: 50%;
      background-color: rgba(0,0,0,0.4);
      opacity: 0.4;
      transform: translateX(-50%) translateY(-50%);
      bottom: -30px;
    }

    .modal {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 990;
    }

    .modal .overlay {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 995;
      background: rgba(0,0,0,0.85);
    }

    .modal .modal-content {
      z-index: 999;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-height: 90%;
      overflow: auto;
      background: #fff;
      padding: 20px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.7);
      text-align: center;
      border-radius: 4px;
      width: 600px;
    }

    .modal .modal-content > h2 {
      font-size: 28px;
      font-weight: 200;
      margin: 20px 0 40px;
      text-align: center;
    }

    .modal .modal-content .buttons-wrapper {
      padding: 20px;
    }

    .modal .close-modal {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
      font-size: 18px;
      opacity: 0.5;
      background: none;
      border: none;
      transition: opacity 0.2s ease;
    }

    .modal .close-modal:hover {
      opacity: 0.9;
    }

    .fa-plus {
      margin-right: 10px;
    }

    .name {
      justify-self: center;
      text-align: center;

      font-family: 'Roboto', Condensed;
      font-style: normal;
      font-weight: normal;
      color: grey;
    }

    input {
      background-color: #f4eac1;
      border-radius: 10px;
      height: 35px;
      width: 200px;
      outline: none;
      color: #834900;
    }

    #name {
      font-family: 'Roboto', Condensed;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      border-width: 2px;
      width: 250px;
      height: 40px;
      margin-bottom: 25px;
      margin-top: 10px;
    }

    label {
      display: block;
    }

    .save-btn {
      background-color: #c69000;
      justify-content: center;
      border: none;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      width: 175px;
      height: 50px;
      filter: drop-shadow(0px 5px 10px rgba(217, 173, 16, 0.4));
      text-align: center;
      margin: 25px auto auto;
    }

    h2 {
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
  </style>
  <button id="modal-opener"><i class="fas fa-plus"></i>Add collection</button>
  <div class="modal" style="display: none">
    <div class="overlay"></div>
    <div class="modal-content">
      <h2>Add name for your new collection</h2>
      <form>
        <div class="name">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Grocery List" />
        </div>
        <br style="clear: both" />
        <div class="save">
          <input class="save-btn" type="button" value="Save Changes" />
        </div>
      </form>
      <button title="Close" class="close-modal">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>

  <script src="../scripts/createCollectionModal.js" type="module"></script>
`;

export default class CreateCollectionModal extends HTMLElement {
  constructor() {
    super();

    // Create shadowRoot
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
  }
}

// in order to display it for scripting convenience, but wants to act as pop up when click btn
customElements.define('create-collection-modal', CreateCollectionModal);
