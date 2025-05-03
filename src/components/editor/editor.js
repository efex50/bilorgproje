import { codeTable, Simulator } from '../../objects';
import './style.css'; 
import {EditorView, basicSetup,} from "codemirror"
import {EditorState, StateEffect} from "@codemirror/state"
import { Examples, Icons } from './Datas';

export default function createEditor() {
  // Initialize CodeMirror editor
  
  const container = document.createElement("div");
  const wrapper = document.createElement("div");
  const buttonContainer = document.createElement("div");
  const runButton = document.createElement("button");
  const tickButton = document.createElement("button");
  let status = new StatusArea();

  {
    container.className = "code-editor-wrapper";
    container.id = "code-area-container";

    wrapper.className = "editor-code-area";
    wrapper.id = "code-textbox-area";
    
    
    buttonContainer.className = "editor-button-area";
    runButton.innerHTML = Icons.play;
    runButton.className = "editor-button";

    tickButton.innerHTML = Icons.tick;
    tickButton.className = "editor-button";
    
    
    buttonContainer.appendChild(runButton);
    buttonContainer.appendChild(tickButton);
    buttonContainer.appendChild(status.node());
  
  
    container.appendChild(buttonContainer);
    container.appendChild(wrapper);
  }






  let simulator = Simulator;
  simulator.setReady()
  
  const view = new EditorView({
    doc:Examples[1],
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

  // Event listener to highlight the line when selected

  // Function to highlight the selected line
  function highlightLine(line) {
    
    line = line-1
    let lines = document.getElementsByClassName("cm-line");
    if (!lines[line].className.split(" ").includes("green-line")){
      lines[line].className =lines[line].className + " green-line"
    }
    console.log(lines);
    
  }




  runButton.addEventListener("click", () => {
    let parent = document.getElementsByClassName("cm-content")[0];
    parent.addEventListener("change",() => {
      console.log("zort");
      
    })
      
    
    
    highlightLine(1)
    
  })
  


  let  isEnded = true;
  function setEditorReadable(ended){
    const extensions = [
      basicSetup, // Includes line numbers, keymaps, etc.
      EditorState.readOnly.of(ended)
    ];
  
    view.dispatch({
      effects:StateEffect.reconfigure.of(extensions)
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
      tickButton.innerHTML = Icons.tick

    }else{

      try{ 

        let {end} = simulator.tick(line[simulator.rgs.ctr]);

        if (end){
          isEnded = true
          setEditorReadable(!isEnded);
          document.querySelector("#editor-status-text").textContent = "the program has ended";
          status.write("restart the app")
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
  console.log("editor container:",container.id);
  
  container.addEventListener("clear", (e) => {
    clearText();    
  })
  container.addEventListener("ReadonlyState", (e) => {
    setEditorReadable(true)
  })
  container.addEventListener("notReadonlyState", (e) => {
    setEditorReadable(false)
  })

  function setObserver(){
    let editor = document.querySelector(".cm-content");
    const config = {attributes:true};
    
    
    let callback = function(mutationList,observer){
      console.log(mutationList);
      
    }

    let observer = new MutationObserver(callback);
    observer.observe(editor,config)
    //setTimeout(() => {observer.disconnect();console.log("disconnected")},2000)
    
  }
  setTimeout(setObserver,100)


  return container;
}




class StatusArea{
  
  
  constructor() {
    this.status = document.createElement("div");
    this.status.className = "editor-status-area";
    this.status.id = "code-status-area";
  
    this.statusText = document.createElement("p");
    this.statusText.innerText = "Status: Ready";
    this.statusText.className = "editor-status-text";
    this.statusText.id = "editor-status-text";
    
    this.status.appendChild(this.statusText);
  
  }

  node(){
    return this.status
  }
  write(text){
    this.statusText.innerHTML = text
  }

}
