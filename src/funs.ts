import { EditorView } from 'codemirror';
import { dbg } from './debug.js';
import { codeTable } from './objects.js';



export function clearCodeArea(){
  const codeArea = document.querySelector("#code-area-container");
  if (!codeArea) {
    console.error("Code area not found");
    return;
  }
  codeArea.dispatchEvent(new CustomEvent("clear"));
}


export function readCodeArea():string[] {
  let view:EditorView = codeTable["t"];
  let lines = view.state.doc.toJSON()
  return lines
} 


export function parseSmartNumber(str) {
  if (typeof str === 'number') return str as number;
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
