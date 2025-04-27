import { codeTable } from '../../objects';
import './style.css'; 
import {EditorView, basicSetup} from "codemirror"

export default function createEditor() {
  // Initialize CodeMirror editor
  
  const container = document.createElement("div");
  container.className = "code-editor-wrapper";
  container.id = "code-area-container";

  const wrapper = document.createElement("div");
  wrapper.className = "editor-code-area";
  wrapper.id = "code-textbox-area";
  
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "editor-button-area";

  const runButton = document.createElement("button");
  runButton.innerText = "Run";
  runButton.className = "editor-button";
  
  buttonContainer.appendChild(runButton);

  container.appendChild(buttonContainer);
  container.appendChild(wrapper);

  const view = new EditorView({
    doc: "Start document\nasasd",
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
    editor.getDoc().removeAllMarks(); // Clear previous highlights
    
    // Add a new highlight to the selected line
    editor.getDoc().markText(
      { line: line, ch: 0 },
      { line: line + 1, ch: 0 },
      { className: 'highlight-line' }
    );
  }


  return container;
}
