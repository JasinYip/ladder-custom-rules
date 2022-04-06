let lastNodesContent = '';
let nodeSelectorContainerElem = document.getElementById('node-selector-container')
let selectedNodeStrElem = document.getElementById('selected-node-str')

function encode(str) {
  const en = {
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    ' ': '&nbsp;',
  }

  let rst = '';
  for (let i = 0; i < str.length; i++) {
    rst = rst + (en[str[i]] || str[i]);
  }
  return rst;
}

function setNodes(nodes) {
  nodeSelectorContainerElem.innerHTML = nodes.map(node => {
    const id = md5(node.src)
    return `
  <div class="form-check">
    <input class="form-check-input" type="checkbox" data-nodeId="${encode(node.nodeId)}" id="${id}">
    <label class="form-check-label" style="white-space: nowrap" for="${id}">
      ${node.src}
    </label>
  </div>
  `
  }).join('\n')
}

function parseNodes(content) {
  const splited = content.split('\n')
                    .filter(s => !s.includes('靠前节点较为拥挤'))
                    .map(s => s.trim());

  return splited.map(s => ({
    src: s,
    nodeId: s.slice(0, s.indexOf('=')).trim()
  }))
}

function getCheckedNodes() {
  return Array.from(document.querySelectorAll('#node-selector-container .form-check-input'))
    .filter(e => e.checked)
    .map(e => e.getAttribute('data-nodeId'))
}

function refreshSelected() {
  const str = getCheckedNodes().join(',');
  selectedNodeStrElem.value = str;
}

function restoreCopyBtn() {
  const elem = document.getElementById('copy-selected');
  elem.innerHTML = '复制';
  elem.classList.remove('btn-outline-success')
  elem.classList.add('btn-success')
}

function checkAll(state) {

  return () => {
    const elems = Array.from(document.querySelectorAll('#node-selector-container .form-check-input'))
    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i];
      if (state === 'inverse') {
        elem.checked = !elem.checked;
      } else {
        elem.checked = state;
      }
    };
    refreshSelected();
  }
}

function copySelected(e) {
  navigator.clipboard.writeText(selectedNodeStrElem.value)
  e.target.innerHTML = '已复制！'
  e.target.classList.add('btn-outline-success')
  e.target.classList.remove('btn-success')
  setTimeout(() => restoreCopyBtn(), 2000)
}

function onNodesContentChanged() {
  const newContent = document.getElementById('nodes-content').value;
  if (lastNodesContent === newContent) { return; }
  const nodes = parseNodes(newContent);
  setNodes(nodes)
  document.getElementById('copy-group').style.visibility = 'visible';
  document.getElementById('check-controller-container').style.visibility = 'visible';
}

async function pasteNodesStr() {
  const str = await navigator.clipboard.readText();
  document.getElementById('nodes-content').value = str;
  document.getElementById('load').click();
}

function initEvents() {
  document.getElementById('load').addEventListener('click', onNodesContentChanged)
  document.getElementById('copy-selected').addEventListener('click', copySelected)
  document.getElementById('check-all').addEventListener('click', checkAll(true))
  document.getElementById('check-none').addEventListener('click', checkAll(false))
  document.getElementById('check-inverse').addEventListener('click', checkAll('inverse'))
  document.getElementById('paste-nodes-str').addEventListener('click', pasteNodesStr)
  nodeSelectorContainerElem.addEventListener('click', refreshSelected)
}

window.onload = async () => {
  initEvents()
}
