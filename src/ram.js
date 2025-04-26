import { dbg } from './debug.js';




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
  




export {
};