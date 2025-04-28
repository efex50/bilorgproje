import { codeTable, Ram, Registers, Simulator, StoredObjects, Table } from './objects.js'
import CodeEditor from './components/editor/editor.js'
import Input from './components/input/input.js'
import { html, render } from 'lit-html';
import Swapper from './components/swapper/swapper.js'
import { readCodeArea } from './funs.js'

export function main() {

    render(html`
        <div class="w3-row">
          <div id="code-area" class="editor-container"></div>
      
          </div>
          <div id="code-debug-area" class="w3-container w3-quarter scrollable-div">
          </div>
          <div class="w3-container w3-quarter scrollable-div">
            <div id="cache1-div"></div>
          </div>
          <div class="w3-container w3-quarter scrollable-div">
            <div id="ram-div"></div>
            <div id="register-div"></div>
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
    
  
    let ram = new Ram(16,16,"ram","ram-div");
    ram.table.init();
    ram.table.render();
    StoredObjects["ram"] = ram;
    let cache = new Table(8,2,"cache","cache1-div");
    cache.init();
    cache.render();
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

