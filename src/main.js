import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { init_table } from './ram.js'
import { main } from './start.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    `
    // table div row
    +`
    <div id="ram-div"></div>
    <div id="cache-div"></div>
  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  init_table(5,5);
  main();
});



export let Debug = true;