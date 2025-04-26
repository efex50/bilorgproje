import './style.css'
import CodeEditor from './components/editor/editor.js'
import Input from './components/input/input.js'
import { main } from './start.js'
import { Registers, StoredObjects, Table } from './objects.js'
import { html, render } from 'lit-html';

render(html`
  <div class="w3-row">
    <div class="w3-container w3-quarter scrollable-div">
      <div id="cache1-div"></div>
    </div>
    <div class="w3-container w3-quarter scrollable-div">
    <div id="ram-div"></div>
    <div id="register-div"></div>
    </div> 
  </div>
`, document.querySelector('#app'));

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');

  // let editor = CodeEditor("as");
  // app.appendChild(editor);

  let reg = new Registers();
  console.log(reg);


  let inputf = Input();
  app.appendChild(inputf);
  let ram = new Table(8,8,"ram","ram-div");
  ram.init();
  ram.render();
  StoredObjects["ram"] = ram;
  let cache = new Table(8,2,"cache","cache1-div");    
  cache.init();
  cache.render();
  StoredObjects["cache1"] = cache;
  //main();
});



export let Debug = true;