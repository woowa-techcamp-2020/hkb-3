function getPath() {
  return location.pathname;
}

function getCurrentPath(e, listNode) {
  if(e.target.nodeName === 'A') e.preventDefault(); 
  const path = listNode.querySelector('a').getAttribute('href');
  return path;
}

async function getInitData() {
  const res = await fetch('/test.json');
  return res.json();
}

async function getState(path) {
  switch(path) {
  case '/':
    return Promise.resolve({});
  case '/calendar':
    return { content: 'hello' };
  default:
    break;
  }
}

function render(renderTarget, sHTML) {
  renderTarget.innerHTML = sHTML;
}

function onLink() {
  document.querySelector('nav ul').addEventListener('click', async (e) => {
    const listNode = e.target.closest('li');
    if(!listNode) return;

    const path = getCurrentPath(e, listNode);
    const state = await getState(path);

    history.pushState(state, '', path);

    popStateHandler({ state });
  });
}

function popStateHandler({ state }) {
  const renderTargetWrap = document.querySelector('.content-wrap');
  const targetView = getPath();

  const contentViewHTML = viewMap[targetView](state?.content);
  render(renderTargetWrap, contentViewHTML);
}

function onRouter() {
  window.addEventListener('popstate', popStateHandler);
}

const viewMap = {
  '/': function() {
    return '<h2>안녕하세요 코드스쿼드에 오셨네요!</h2>';
  },
  '/calendar': function(data) {
    if(!data) return;
    return ('<h2>calender</h2>'); 
  },
  '/statistics': function (data) {
    return (`<h2>Statices</h2>`);
  },

};

!(function() {
  onLink();
  onRouter();
  popStateHandler({});
}());

