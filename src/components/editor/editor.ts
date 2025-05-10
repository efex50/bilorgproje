import { codeTable, Simulator } from '../../objects';
import './style.css'; 
import {EditorView, basicSetup,} from "codemirror"
import {EditorState, StateEffect} from "@codemirror/state"
import { Examples, Icons } from './Datas';

export default function createEditor() {
  // highlighting class name
  let lineClass = "green-line"

  
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
  simulator.setReady(undefined)
  
  const view = new EditorView({
    doc:Examples["func"],
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
  let observer:MutationObserver;

  // Function to highlight the selected line
  function highlightLine(line) {
    if (observer !== undefined){
      
      observer.disconnect();
    }

    const config = {attributes:true};
    let selected = document.getElementsByClassName("cm-line")[line-1]

    function add_class(){
      let classes = selected.className.split(" ");
      if (!classes.includes(lineClass)){
        classes.push(lineClass)
        selected.className = classes.join(" ");
      }
    }
    let callback = function(mutationList,observer){
      add_class()
    }

    observer = new MutationObserver(callback);
    observer.observe(selected,config)

    add_class()
    
  }

  function clearLine(line){

    let selected = document.getElementsByClassName("cm-line")[line-1]
    
    function remove_class(){
      let classes = selected.className.split(" ").filter(item => item !== lineClass);
      let newName = classes.join(" ")
      selected.className=newName;
      
    }
    remove_class()

  }


  runButton.addEventListener("click", () => {
      
    
    
    highlightLine(2)
    
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
    let lines = view.state.doc.toJSON();

    if (isEnded){

      isEnded = false
      setEditorReadable(!isEnded);
      simulator.reset();
      simulator.setReady(lines);
      const statusTextElement = document.querySelector("#editor-status-text");
      if (statusTextElement) {
        statusTextElement.textContent = "the program has benn started";
      }
      // clear or highlight last text
      try{
        highlightLine(simulator.rgs.ctr+1);
      }
      catch(e){        
        observer.disconnect();
        clearLine(simulator.rgs.ctr)
      }

      tickButton.innerHTML = Icons.tick

    }else{

      try{ 

        simulator.tick(lines[simulator.rgs.ctr]);
        
        try{
          highlightLine(simulator.rgs.ctr+1);
          // make rgs cell glow red
          simulator.rgs.ctr = simulator.rgs.ctr;
          isEnded = false
          setEditorReadable(!isEnded);
        }
        catch(e){
          console.log("lol");
          if (observer !== undefined){
            observer.disconnect();
          }
          clearLine(simulator.rgs.ctr)
        
          isEnded = true
          setEditorReadable(!isEnded);
          const statusTextElement = document.querySelector("#editor-status-text");
          if (statusTextElement) {
            statusTextElement.textContent = "the program has ended";
          }
          status.write("restart the app")
        }
      
      } catch(e){
        console.log("Error in tick", e);

      }
    }
  })
  


  // e = {line:number}
  container.addEventListener("highlight", (e) => {
    e = e as CustomEvent;
    highlightLine(e)
  })
  
  container.addEventListener("clear", (e) => {
    clearLine(0);
    clearText();    
  })
  container.addEventListener("ReadonlyState", (e) => {
    setEditorReadable(true)
  })
  container.addEventListener("notReadonlyState", (e) => {
    setEditorReadable(false)
  })






  return container;
}




class StatusArea{
  statusText: any;
  status: HTMLDivElement;
  
  
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
