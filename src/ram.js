import { dbg } from './debug.js';
import { Ram } from './objects.js';

function createMemoryRam(rowCount, lineCount) {
    Ram.lines = lineCount; // Set the number of lines in the table
    Ram.rows = rowCount; // Set the number of rows in the table
    // Dynamically create the table data
    const tableData = [];
    let ctr = 0;
    for (let i = 0; i < rowCount; i++) {
        const row = [];
        for (let j = 0; j < lineCount; j++) {
            row.push({ content: `${i + 1},${j + 1}`,id:ctr }); // Add cell content
            ctr+=8;
        }
        tableData.push(row);
    }

    // Add the generated table data to the Ram array
    Ram.arr = tableData;
}


function init_table(rowCount, lineCount) {
    const tableDiv = document.getElementById('table-div');

    // Generate a table with 5 rows and 5 columns
    createMemoryRam(rowCount, lineCount);
    Ram.render();
    
}


// id = string as 0x01 or 01 or 1 or 0b01 or 0o01
function setRamField(context, id) {
    let idx = parseSmartNumber(context);
    if (isNaN(idx)) {
        throw new Error('Invalid id: not a number');
    }
    const { lines, rows } = Ram;
    
    if ( idx < 0 || idx >= lines * rows) {
      throw new Error('Invalid id: out of bounds');
    }
  
    const line = Math.floor(idx / rows);
    const col = idx % rows;
    try {
        Ram.set(line, col, idx);
    }catch (e) {
        throw e;
    }
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
      return Number(str); // or parseFloat(str) if you want to support decimals
    }
}
  




export {
    init_table,
    setRamField,
};