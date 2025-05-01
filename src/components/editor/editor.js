import { codeTable, Simulator } from '../../objects';
import './style.css'; 
import {EditorView, basicSetup,} from "codemirror"
import {EditorState, StateEffect} from "@codemirror/state"

export default function createEditor() {
  // Initialize CodeMirror editor
  
  const container = document.createElement("div");
  const wrapper = document.createElement("div");
  const buttonContainer = document.createElement("div");
  const runButton = document.createElement("button");
  const tickButton = document.createElement("button");
  let status = statusArea();

  {
    container.className = "code-editor-wrapper";
    container.id = "code-area-container";

    wrapper.className = "editor-code-area";
    wrapper.id = "code-textbox-area";
    
    
    buttonContainer.className = "editor-button-area";
    runButton.innerText = "Run";
    runButton.className = "editor-button";

    tickButton.innerText = "Tick";
    tickButton.className = "editor-button";
    
    
    buttonContainer.appendChild(runButton);
    buttonContainer.appendChild(tickButton);
    buttonContainer.appendChild(status);
  
  
    container.appendChild(buttonContainer);
    container.appendChild(wrapper);
  }






  let simulator = Simulator;
  simulator.setReady()
  

let doc = `imm r1 10
mov 0x1 0x0
add 0x0 r1
mov 0x2 0x0
add 0x0 r1
mov 0x3 0x0
add 0x0 r1`
  const view = new EditorView({
    doc,
    parent: wrapper,
    extensions: [
      basicSetup,
    ]
  })

  

  codeTable["t"] = view;

  function clearText() {
    view.dispatch({
      changes: {from: 0, to: view.state.doc.length, insert: ""}
    })
  }





  runButton.addEventListener("click", () => {
    console.log(isEnded);
    setEditorReadable(false);

    
  })
  


  let  isEnded = true;
  function setEditorReadable(ended){
    console.log("editor readonly:",ended);
    
    view.dispatch({
      effects:StateEffect.appendConfig.of(EditorState.readOnly.of(ended))
    })
  }
  
  tickButton.addEventListener("click", () => {
    let line = view.state.doc.toJSON();

    if (isEnded){

      isEnded = false
      setEditorReadable(!isEnded);
      simulator.reset();
      simulator.setReady(line);
      document.querySelector("#editor-status-text").textContent = "the program has benn started";
      tickButton.textContent = "Tick"

    }else{


      try{ 

        let {end} = simulator.tick(line[simulator.rgs.ctr]);

        if (end){
          isEnded = true
          setEditorReadable(!isEnded);
          document.querySelector("#editor-status-text").textContent = "the program has ended";
          tickButton.textContent = "restart the app"
        }else{
          isEnded = false
          setEditorReadable(!isEnded);

        }
      
      } catch(e){
        console.log("Error in tick", e);

      }
    }
  })
  


  // e = {line:number}
  container.addEventListener("highlight", (e) => {
    
    console.log("ZORT",e.detail.line)
  })

  container.addEventListener("clear", (e) => {
    clearText();    
  })

  

  // Event listener to highlight the line when selected

  // Function to highlight the selected line
  function highlightLine(editor) {
    const line = editor.getCursor().line; // Get the current line
    const allLines = editor.getDoc().lineCount(); // Get total line count
    view.getDoc().removeAllMarks(); // Clear previous highlights
    
    // Add a new highlight to the selected line
    editor.getDoc().markText(
      { line: line, ch: 0 },
      { line: line + 1, ch: 0 },
      { className: 'highlight-line' }
    );
  }

  return container;
}




function statusArea() {
  const status = document.createElement("div");
  status.className = "editor-status-area";
  status.id = "code-status-area";

  const statusText = document.createElement("p");
  statusText.innerText = "Status: Ready";
  statusText.className = "editor-status-text";
  statusText.id = "editor-status-text";
  
  status.appendChild(statusText);



  return status;
}