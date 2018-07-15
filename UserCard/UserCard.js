const currentDocument = document.currentScript.ownerDocument;

class UserCard extends HTMLElement {
    constructor() {
      super();

      this.addEventListener('click', e => {
        this.toggleCard();
      });
    }
    connectedCallback(){
      const shadowRoot = this.attachShadow({mode:'open'});
    
      //select template, clone and attach. Current doc needs ot be defined to get DOM access ot imported
      const template = currentDocument.querySelector('#user-card-template');
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);
    
      // extract attribute user-id from element
      const userId = this.getAttribute('user-id');
    
      //fetch data for that user ID and call render   
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then((response)=>{
          return response.json()
        })
        .then((responseText) => {
          this.render(responseText);
        })
        .catch((error)=>{
          console.error(error)
        })
    }

    render(userData){
      //fill the card using DOm manipulation APIs
      //all components are shadow dom so use this.shadowRoot
      //calling selectors on this the DOM searches on that subtree only

      this.shadowRoot.querySelector('.card__full-name').innerHTML = userData.name;
      this.shadowRoot.querySelector('.card__user-name').innerHTML = userData.username;
      this.shadowRoot.querySelector('.card__website').innerHTML = userData.website;
      this.shadowRoot.querySelector('.card__address').innerHTML = `<h4>Address</h4>
      ${userData.address.suite}, <br />
      ${userData.address.street}, <br />
      ${userData.address.city}, <br />
      Zipcode: ${userData.address.zipcode}`
    }
  
    toggleCard() {
      let elem = this.shadowRoot.querySelector('.card__hidden-content');
      let btn = this.shadowRoot.querySelector('.card__details-btn');
      btn.innerHTML = elem.style.display == 'none' ? 'Less Details' : 'More Details';
      elem.style.display = elem.style.display == 'none' ? 'block' : 'none';
    }
  }
  
  customElements.define('user-card', UserCard);