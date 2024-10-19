// 创建浮动图标
const floatIcon = document.createElement('div');
floatIcon.id = 'float-icon';
floatIcon.innerHTML = '<img src="' + chrome.runtime.getURL('icons/icon48.png') + '" alt="中午吃什么">';
document.body.appendChild(floatIcon);

// 添加点击事件处理程序
floatIcon.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'openPopup' });
});

// 添加拖动功能
let isDragging = false;
let offsetX, offsetY;

floatIcon.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - floatIcon.getBoundingClientRect().left;
  offsetY = e.clientY - floatIcon.getBoundingClientRect().top;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
  if (isDragging) {
    floatIcon.style.left = `${e.clientX - offsetX}px`;
    floatIcon.style.top = `${e.clientY - offsetY}px`;
  }
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}