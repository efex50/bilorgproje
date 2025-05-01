import {Content, StoredObjects} from "../../objects.js";
import './style.css';

export default function Swapper() {
    const container = document.createElement('div');
    container.className = 'tag-data-container';
  
    // Select input
    const selectNerden = document.createElement('select');
    selectNerden.className = 'id-tag-select';
    
    const selectNereye = document.createElement('select');
    selectNereye.className = 'id-tag-select';
    
    const options = ['ram'];
    options.forEach(opt => {
      selectNerden.appendChild(createOption(opt));
      selectNereye.appendChild(createOption(opt));
    });
  
    // id input
    const IdInput = document.createElement('input');
    IdInput.type = 'string';
    IdInput.placeholder = 'Sektörü gir';
    IdInput.className = 'data-input';
    
    const outInput = document.createElement('input');
    outInput.type = 'string';
    outInput.placeholder = 'Hedef Sektörü gir';
    outInput.className = 'data-input';
    

    // Button
    const dataButton = document.createElement('button');
    dataButton.textContent = 'Apply';
    dataButton.className = 'apply-button';
  
    // Button click handler
    dataButton.addEventListener('click', () => {
        
      const fromObj = selectNerden.value;
      const targetObj = selectNereye.value;
      let fromId = parseSmartNumber(IdInput.value);
      let targetId = parseSmartNumber(outInput.value);

      if (isNaN(fromId) || isNaN(targetId)) {
        console.log("Invalid number input Todo!");
        
      }
      let tbw = StoredObjects[fromObj].getId(fromId);
      console.log(tbw);
      

      StoredObjects[targetObj].setId(targetId ,tbw.content);
    });
    // options
    function updateOptions(){
      const selectedId = selectNerden.value;
      if (options.length === Object.keys(StoredObjects).length) {
        return;          
      }else{
        let ctr = 0;
        for (const key in StoredObjects) {
          options[ctr] = key;
          ctr++;
        }
        selectNerden.innerHTML = ''; // Clear existing options
        selectNereye.innerHTML = ''; // Clear existing options

        options.forEach(opt => {
          selectNerden.appendChild(createOption(opt));
          selectNereye.appendChild(createOption(opt));

        });
        
        // Example: you could trigger something else here
        // const event = new CustomEvent('optionSelected', {
        //   detail: { id: selectedId }
        // });
        // container.dispatchEvent(event);
      }

    }
    selectNerden.addEventListener('click', () => {
      updateOptions();
    });
    selectNereye.addEventListener('click', () => {
      updateOptions();
    });

  
    // Assemble
    container.appendChild(selectNerden);
    container.appendChild(selectNereye);
    container.appendChild(IdInput);
    container.appendChild(outInput);
    container.appendChild(dataButton);
  
    return container;
}

  function createOption(opt) {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt;
    return option;
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


