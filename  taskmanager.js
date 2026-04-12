// ========== 1. 获取页面元素 ==========
const modal = document.getElementById('taskModal');
const saveBtn = document.getElementById('saveTaskBtn');
const cancelBtn = document.getElementById('cancelModalBtn');
const addButtons = document.querySelectorAll('.add-btn');
const todoList = document.getElementById('todoList');
const inProgressList = document.getElementById('inProgressList');
const doneList = document.getElementById('doneList');
const taskCounterSpan = document.getElementById('task-counter');
const priorityFilter = document.getElementById('priority-filter');
const clearDoneBtn = document.getElementById('clearDoneBtn');

const modalTitle = document.getElementById('modalTitle');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescInput = document.getElementById('taskDesc');
const taskPrioritySelect = document.getElementById('taskPriority');
const taskDueDateInput = document.getElementById('taskDueDate');


let tasks = [];
let currentColumn = 'todo';

let editingTaskId = null;

function updateTaskCounter() {
    taskCounterSpan.textContent = tasks.length;
}

function closeModal() {
    modal.style.display = 'none';
    editingTaskId = null;
}
// 打开弹窗 - 新增任务
function openModalForAdd(columnId) {
    currentColumn = columnId;
    editingTaskId = null;
    modalTitle.textContent = 'Add New Task';
    
    taskTitleInput.value = '';
    taskDescInput.value = '';
    taskPrioritySelect.value = 'medium';
    taskDueDateInput.value = '';
    
    modal.style.display = 'flex';
}