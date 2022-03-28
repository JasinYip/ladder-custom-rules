let lastNodesContent = '';
let nodeSelectorContainerElem = document.getElementById('node-selector-container')
let selectedNodeStrElem = document.getElementById('selected-node-str')

function setNodes(nodes) {
  nodeSelectorContainerElem.innerHTML = nodes.map(node => {
    const id = md5(node.src)
    return `
  <div class="form-check">
    <input class="form-check-input" type="checkbox" data-nodeId="${node.nodeId}" id="${id}">
    <label class="form-check-label" style="white-space: nowrap" for="${id}">
      ${node.src}
    </label>
  </div>
  `
  }).join('\n')
}

function parseNodes(content) {
  const splited = content.split('\n').slice(1).map(s => s.trim());
  return splited.map(s => ({
    src: s,
    nodeId: s.slice(0, s.indexOf('|')).trim()
  }))
}

function getCheckedNodes() {
  return Array.from(document.querySelectorAll('#node-selector-container .form-check-input'))
    .filter(e => e.checked)
    .map(e => e.getAttribute('data-nodeId'))
}

function refreshSelected() {
  const str = getCheckedNodes().join(' | ');
  selectedNodeStrElem.value = str;
}

function restoreCopyBtn() {
  const elem = document.getElementById('copy-selected');
  elem.innerHTML = '复制';
  elem.classList.remove('btn-outline-success')
  elem.classList.add('btn-success')
}

function copySelected(e) {
  navigator.clipboard.writeText(selectedNodeStrElem.value)
  e.target.innerHTML = '已复制！'
  e.target.classList.add('btn-outline-success')
  e.target.classList.remove('btn-success')
  setTimeout(() => restoreCopyBtn(), 2000)
}

function onNodesContentChanged(e) {
  const newContent = document.getElementById('nodes-content').value;
  if (lastNodesContent === newContent) { return; }
  const nodes = parseNodes(newContent);
  setNodes(nodes)
  document.getElementById('copy-group').style.visibility = 'visible';
}

async function pasteNodesStr() {
  const str = await navigator.clipboard.readText();
  document.getElementById('nodes-content').value = str;
}

function initEvents() {
  document.getElementById('load').addEventListener('click', onNodesContentChanged)
  document.getElementById('copy-selected').addEventListener('click', copySelected)
  document.getElementById('paste-nodes-str').addEventListener('click', pasteNodesStr)
  nodeSelectorContainerElem.addEventListener('click', refreshSelected)

}

window.onload = async () => {
  initEvents()
}
