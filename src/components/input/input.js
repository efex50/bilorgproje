import {StoredObjects} from "../../objects.js";
import './style.css';

export default function TagDataInput() {
    const container = document.createElement('div');
    container.className = 'tag-data-container';
  
    // Select input
    const select = document.createElement('select');
    select.className = 'id-tag-select';
    console.log(StoredObjects);
    
    const options = ['ram'];
    options.forEach(opt => {
      const optionElement = document.createElement('option');
      optionElement.value = opt;
      optionElement.textContent = opt;
      select.appendChild(optionElement);
    });
  
    // Number input
    const numberInput = document.createElement('input');
    numberInput.type = 'string';
    numberInput.placeholder = 'Yeni sayı gir';
    numberInput.className = 'data-input';

    // id input
    const IdInput = document.createElement('input');
    IdInput.type = 'string';
    IdInput.placeholder = 'Sektörü gir';
    IdInput.className = 'data-input';
    

    // Button
    const dataButton = document.createElement('button');
    dataButton.textContent = 'Apply';
    dataButton.className = 'apply-button';
  
    // Button click handler
    dataButton.addEventListener('click', () => {
        
        const selectedId = select.value;
        const value = parseSmartNumber(numberInput.value);
        const id = parseSmartNumber(IdInput.value);
        
        // hata kontrolü
        // todo!
        if (isNaN(value)) {
          console.log("Invalid number input Todo!");
          
        }
        StoredObjects[selectedId].setId(id ,value);

        const targetDiv = document.getElementById(selectedId);
  
      if (targetDiv) {
        targetDiv.textContent = value;
      }
    });
    // options
    select.addEventListener('click', () => {
        const selectedId = select.value;
        if (options.length === Object.keys(StoredObjects).length) {
          return;          
        }else{
          let ctr = 0;
          for (const key in StoredObjects) {
            options[ctr] = key;
            ctr++;
          }
          select.innerHTML = ''; // Clear existing options
          options.forEach(opt => {
            const optionElement = document.createElement('option');
            optionElement.value = opt;
            optionElement.textContent = opt;
            select.appendChild(optionElement);
          });
          
          // Example: you could trigger something else here
          // const event = new CustomEvent('optionSelected', {
          //   detail: { id: selectedId }
          // });
          // container.dispatchEvent(event);
        }
      });
    
  
    // Assemble
    container.appendChild(select);
    container.appendChild(IdInput);
    container.appendChild(numberInput);
    container.appendChild(dataButton);
  
    return container;
  }
  

  

function parseSmartNumber(str) {
    if (typeof str !== 'string') return NaN;
  
    // Trim whitespace just in case
    str = str.trim();
  
    // Check for known prefixes and parse accordingly
    if (str.startsWith('0x') || str.startsWith('0X')) {
      return parseInt(str, 16);
    } else if (str.startsWith('0b') || str.startsWith('0B')) {
      return parseInt(str, 2);
    } else if (str.startsWith('0o') || str.startsWith('0O')) {
      return parseInt(str, 8);
    } else {
        try {
            return Number(str); // or parseFloat(str) if you want to support decimals
        } catch (e) {
            return NaN; // Return NaN if parsing fails
        }
    }
}


