class SearchBar extends HTMLElement{
    constructor(){
        super();
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
            .search-icon {
                margin: 5px;
            }
            
            .search-input{
                border-style:none;
                width: 80%;
            }
        </style>
            <img src="" alt="" class="search-icon">
            <input type="text" placeholder="Search" class="search-input">
        `;
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('search-bar', SearchBar);