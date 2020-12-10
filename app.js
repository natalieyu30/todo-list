// select item
const date = document.querySelector('.today');
const input = document.getElementById('todo');
const addBtn = document.querySelector('.add-btn');
const listContainer = document.querySelector('.list-container');
const list = document.querySelector('.list');
const clearBtn = document.querySelector('.clear-btn');
const radioControl = document.querySelector('.radio-control')

let checkFlag = false;
let checkId = '';


// **** Event Listener ****
addBtn.addEventListener('click', addItem);
clearBtn.addEventListener('click', clearList);
window.addEventListener('DOMContentLoaded', setupTodos);
radioControl.addEventListener('click', filterList);


// **** Function ****
function addItem(e) {
  e.preventDefault();
  const value = input.value;
  const id = new Date().getTime().toString();
  if (value) {
    createListItems(id, value);
    input.value = '';
    // add to localStorage
    addToLocalStorage(id, value, checkFlag);
  }
}

function clearList() {
  let response = confirm('Do you want to delete all the todo list?');
  if (response === true) {
    const listItems = document.querySelectorAll('.list-item')
    listItems.forEach(item => list.removeChild(item))
    listContainer.classList.remove('show-container');
    // remove localStorage
    localStorage.removeItem('todos');
  }
}

function checkItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  checkId = element.dataset.id;
  if (!element.classList.contains('checked')) {
    element.classList.add('checked');
    checkFlag = true;
    // checkFlag on the local storage
    checkToLocalStorage(checkId, true);
  } else {
    element.classList.remove('checked');
    checkFlag = false;
    // uncheck local storage
    checkToLocalStorage(checkId, false);
  }
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const itemId = element.dataset.id
  list.removeChild(element)
  if (list.children.length ===0 ) {
    listContainer.classList.remove('show-container');
  }
  // remove from local storage
  removeFromLocalStorage(itemId)
}


//  *** radio event function ****
function filterList(e) {
  const articles = document.querySelectorAll('.list-item');
  console.log(articles)
  articles.forEach(article => {
    const radioValue = e.target.value;
    if (radioValue === 'checked') {
      article.classList.contains('checked')? article.style.display ='flex' : article.style.display='none';
    }
    else if (radioValue === 'unchecked') {
      !article.classList.contains('checked')? article.style.display ='flex' : article.style.display='none';
    }
    else {
      article.style.display = 'flex';
    }
  })
}

// localStorage API
// setItem
// getItem
// removeItem 
// **** Local Storage ****
function addToLocalStorage(id, value, checkFlag) {
  const todo = {id, value, checkFlag}
  console.log(todo)
  let lists = getLocalStorage();
  lists.push(todo)
  localStorage.setItem('todos', JSON.stringify(lists))
}

function removeFromLocalStorage(itemId) {
  let lists = getLocalStorage();
  lists = lists.filter(todo => {
    if (todo.id !== itemId) {
      return todo
    }
  })
  localStorage.setItem('todos', JSON.stringify(lists))
}

function checkToLocalStorage(checkId, checkFlag) {
  let lists = getLocalStorage();
  lists = lists.map(todo => {
    if (todo.id === checkId) {
      todo.checkFlag = checkFlag;
    }
    return todo
  })
  localStorage.setItem('todos', JSON.stringify(lists));
}

function getLocalStorage() {
  return localStorage.getItem('todos')? JSON.parse(localStorage.getItem('todos')) : []
}

//  **** Setup Items ****
function setupTodos() {
  let todoLists = getLocalStorage();
  if (todoLists.length > 0) {
    todoLists.forEach(todo => {
      if (!todo.checkFlag) {
        createListItems(todo.id, todo.value);
      } else {
        createListItems(todo.id, todo.value);
        setupCheckeditems(todo.id);
      }    
    })
  }
}

function createListItems(id, value) {
  // add value to list
  const element = document.createElement('article');
  element.classList.add('list-item');
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="check-btn">
      <i class="fa fa-check"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`
  list.appendChild(element);

  // btns
  const checkBtn = element.querySelector('.check-btn');
  const deleteBtn = element.querySelector('.delete-btn');
  checkBtn.addEventListener('click', checkItem);
  deleteBtn.addEventListener('click', deleteItem);

  listContainer.classList.add('show-container');
}

function setupCheckeditems(id){
  const articles = document.querySelectorAll('.list-item')
  articles.forEach(article => {
    if (article.dataset.id === id) {
      article.classList.add('checked');
    }
  })
}

const months = ['january', 'febrary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const today = new Date();
const weekday = weekdays[today.getDay()];
const month = months[today.getMonth()];
const todayDate = today.getDate();
const year = today.getFullYear();
const showDate = [weekday, month, todayDate, year];

date.innerHTML = `${showDate[0]}, ${showDate[1]} ${showDate[2]} ${showDate[3]}` 