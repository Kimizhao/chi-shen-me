document.addEventListener('DOMContentLoaded', function() {
  const menuList = document.getElementById('menu-list');
  const newItemInput = document.getElementById('new-item');
  const addItemButton = document.getElementById('add-item');
  const randomItemButton = document.getElementById('random-item');
  const resetWeekButton = document.getElementById('reset-week');
  const eatenList = document.getElementById('eaten-list');
  const modal = document.getElementById('myModal');
  const modalText = document.getElementById('modal-text');
  const confirmButton = document.getElementById('confirm-button');
  const cancelButton = document.getElementById('cancel-button');

  let menu = [];
  let eatenThisWeek = [];
  let selectedItem = null;
  let modalCallback = null;

  // 从存储中加载菜单和本周已吃的菜品
  chrome.storage.sync.get(['menu', 'eatenThisWeek'], function(data) {
    if (data.menu) menu = data.menu;
    if (data.eatenThisWeek) eatenThisWeek = data.eatenThisWeek;
    renderMenu();
    renderEatenList();
  });

  // 渲染菜单
  function renderMenu() {
    menuList.innerHTML = '';
    menu.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.textContent = item;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '删除';
      deleteButton.onclick = () => deleteItem(index);
      div.appendChild(deleteButton);
      menuList.appendChild(div);
    });
  }

  // 渲染本周已吃的菜品
  function renderEatenList() {
    eatenList.innerHTML = '';
    eatenThisWeek.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'eaten-item';
      div.textContent = `${entry.date}: ${entry.item}`;
      eatenList.appendChild(div);
    });
  }

  // 添加新菜品
  addItemButton.onclick = function() {
    const newItem = newItemInput.value.trim();
    if (newItem) {
      menu.push(newItem);
      newItemInput.value = '';
      saveMenu();
      renderMenu();
    }
  };

  // 删除菜品
  function deleteItem(index) {
    menu.splice(index, 1);
    saveMenu();
    renderMenu();
  }

  // 随机选择未吃过的菜品
  randomItemButton.onclick = function() {
    const remainingItems = menu.filter(item => !eatenThisWeek.some(entry => entry.item === item));
    if (remainingItems.length > 0) {
      const today = new Date().toLocaleDateString('zh-CN');
      const alreadySelectedToday = eatenThisWeek.some(entry => entry.date === today);

      if (alreadySelectedToday) {
        showModal('今天已经选过了！', null, true);
      } else {
        selectedItem = remainingItems[Math.floor(Math.random() * remainingItems.length)];
        showModal(`今天吃：${selectedItem}\n确认选择吗？`, function() {
          eatenThisWeek.push({ item: selectedItem, date: today });
          saveEatenThisWeek();
          renderEatenList();
        });
      }
    } else {
      showModal('本周的菜品已经吃完了！', null, true);
    }
  };

  // 重置本周已吃的菜品
  resetWeekButton.onclick = function() {
    showModal('本周已重置！', function() {
      eatenThisWeek = [];
      saveEatenThisWeek();
      renderEatenList();
    }, true);
  };

  // 显示模态对话框
  function showModal(message, callback, confirmOnly = false) {
    modalText.textContent = message;
    modal.style.display = "block";
    modalCallback = callback;
    if (callback) {
      confirmButton.style.display = "inline-block";
      cancelButton.style.display = confirmOnly ? "none" : "inline-block";
    } else {
      confirmButton.style.display = "none";
      cancelButton.style.display = "none";
    }
  }

  // 确认按钮
  confirmButton.onclick = function() {
    if (modalCallback) modalCallback();
    modal.style.display = "none";
  };

  // 退出按钮
  cancelButton.onclick = function() {
    modal.style.display = "none";
  };
  
  // 点击模态对话框外部关闭对话框
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // 保存菜单到存储
  function saveMenu() {
    chrome.storage.sync.set({ menu });
  }

  // 保存本周已吃的菜品到存储
  function saveEatenThisWeek() {
    chrome.storage.sync.set({ eatenThisWeek });
  }
});