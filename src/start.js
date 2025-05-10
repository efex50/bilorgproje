import { codeTable, Ram, Registers, Simulator, StoredObjects, Table } from './objects.js'
import CodeEditor from './components/editor/editor.js'
import Input from './components/input/input.js'
import { html, render } from 'lit-html';
import Swapper from './components/swapper/swapper.js'
import { readCodeArea } from './funs.js'
import { Cache } from './cache.js';
import './w3.css'
export function main() {

    render(html`
<div class="w3-flex w3-padding" style="gap:8px">
  <div id="code-area" class="editor-container"></div>
  <div id="cache1-div"></div>
  <div id="register-div"></div>
</div>
<div class="w3-row">
  </div>
  <div id="code-debug-area" class=" scrollable-div">
  </div>
  <div class=" scrollable-div">
    <div id="ram-div"></div>
  </div> 
</div>
      `, document.querySelector('#app'));
      
    console.log("Main function started");
    const app = document.querySelector('#app');

    let editor = CodeEditor();
    document.querySelector("#code-area").appendChild(editor);
  
    
    let inputf = Input();
    app.appendChild(inputf);
    
    
    let swapper = Swapper();
    app.appendChild(swapper);
  
  
    let reg = new Registers();
    reg.table.render();
    StoredObjects["registers"] = reg;
    
  
    let ram = new Ram(8,32,"ram","ram-div");
    ram.table.init();
    ram.table.render();
    StoredObjects["ram"] = ram;
    let cache = new Cache(8,2,"cache","cache1-div");
    cache.table.init();
    cache.table.render();
    ram.setCache(cache);

    let l = cache.idLookup(1)
    console.log(l);
    
    
    StoredObjects["cache1"] = cache;
  


    //Simulator.rgs = reg;
    //Simulator.ram = ram;
    //Simulator.cache = cache;
    Simulator.setReady()
    readCodeArea()
    
    
    let reggy = StoredObjects["registers"];
    let a = "r2";
  
    let str = "Start document\nasasd";
    
  
  
    codeTable["t"].state.doc
      
}

