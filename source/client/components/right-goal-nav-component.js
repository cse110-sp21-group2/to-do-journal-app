/* eslint-disable no-undef */

class RightGoalNav extends HTMLElement {
    constructor() {
      super();
  
      // templated HTML content
      const template = document.createElement('template');
  
      template.innerHTML = `
		    <style>
                @font-face {
                    font-family: 'Tw Cen MT Std Medium Cond';
                    font-style: normal;
                    font-weight: normal;
                    src: local('Tw Cen MT Std Medium Cond'), url('../assets/TwCenMTStdMediumCond.woff') format('woff');
                }
                .calendar-region{
                    width: 200px;
                    height:200px;
                    display:grid;
                    grid-template-columns: auto;
                    grid-template-rows: 30px auto;
                }
                
                .month-selector {
                    margin: 0px auto;
                    background-color: #d5ab09;
                    border-radius: 20px;
                    color:white;
                    width: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }
                
                .month-selector i {
                    color: white;
                }
                
                .month-days{
                    display:grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
                    margin: 10px;
                }
                
                .right-month-button,
                .left-month-button {
                    background-color: #ffffff00;
                    border: none;
                }
                
                .date-number {
                    font-family: 'Tw Cen MT Std Medium Cond';
                    width: 18px;
                    height: 20px;
                    text-align: center;
                    color:#162a47
                }
                
                .calendar-seperator{
                    border-style: solid;
                    border-width: 3px;
                    border-radius: 3px;
                }
                
                .goals-label{
                    font-family: Unica One;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 40px;
                    line-height: 47px;
                    display: flex;
                }
                
                .goals-element{
                    font-size: 20px;
                    line-height: 37px;
                    text-align: left;
                }
		    </style>
            <div class="calendar-region">
            <div class="month-selector">
                <button type="button" class=left-month-button><i class="fas fa-chevron-left"></i></button>
                <h3 class="current month">May</h3>
                <button type="button" class="right-month-button"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="month-days">
                <div class="date-number">26</div>
                <div class="date-number">27</div>
                <div class="date-number">28</div>
                <div class="date-number">29</div>
                <div class="date-number">30</div>
                <div class="date-number">1</div>
                <div class="date-number">2</div>
                <div class="date-number">3</div>
                <div class="date-number">4</div>
                <div class="date-number">5</div>
                <div class="date-number">6</div>
                <div class="date-number">7</div>
                <div class="date-number">8</div>
                <div class="date-number">9</div>
                <div class="date-number">10</div>
                <div class="date-number">11</div>
                <div class="date-number">12</div>
                <div class="date-number">13</div>
                <div class="date-number">14</div>
                <div class="date-number">15</div>
                <div class="date-number">16</div>
                <div class="date-number">17</div>
                <div class="date-number">18</div>
                <div class="date-number">19</div>
                <div class="date-number">20</div>
                <div class="date-number">21</div>
                <div class="date-number">22</div>
                <div class="date-number">23</div>
                <div class="date-number">24</div>
                <div class="date-number">25</div>
                <div class="date-number">26</div>
                <div class="date-number">27</div>
                <div class="date-number">28</div>
                <div class="date-number">29</div>
                <div class="date-number">30</div>
                <div class="date-number">31</div>
                <div class="date-number">1</div>
                <div class="date-number">2</div>
                <div class="date-number">3</div>
                <div class="date-number">4</div>
                <div class="date-number">5</div>
                <div class="date-number">6</div>
            </div>
        </div>
        <div>
            <hr class="calendar-seperator">
            <h2 class="goals-label">Goals</h2>
        </div>
        <div class="goals-container">
            <div class="goals-element">Study for at least 2 hours</div>
            <div class="goals-element">Maintain workout schedule</div>
        </div>
        `;
    
      // create a shadow root for this web component
      this.attachShadow({ mode: 'open' })
      // attach cloned content of template to shadow DOM 
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  
}
  
// Define, instantiate, and add the component to its respective div to the calling document
customElements.define('right-goal-nav-component', RightGoalNav);
const comp = document.createElement('right-goal-nav-component');
document.querySelector('.right-nav').appendChild(comp);
