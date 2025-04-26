import './style.css';

// catgpt yazdı
export default function CodeEditor(idName = 'codeArea') {
  const container = document.createElement('div');
  container.className = 'editor-container';

  const lineNumbers = document.createElement('div');
  lineNumbers.className = 'line-numbers';
  lineNumbers.id = 'lineNumbers';
  lineNumbers.innerHTML = '<span>1</span>';

  const textarea = document.createElement('textarea');
  textarea.id = 'codeArea';

  // Functions
  function updateLines() {
    const lines = textarea.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => `<span>${i + 1}</span>`).join('');
  }

  function syncScroll() {
    lineNumbers.scrollTop = textarea.scrollTop;
  }

  textarea.addEventListener('input', updateLines);
  textarea.addEventListener('scroll', syncScroll);

  container.appendChild(lineNumbers);
  container.appendChild(textarea);

  return container;
}
