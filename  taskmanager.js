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

function openModalForEdit(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    editingTaskId = taskId;
    currentColumn = task.column;
    modalTitle.textContent = 'Edit Task';
    
    taskTitleInput.value = task.title;
    taskDescInput.value = task.description || '';
    taskPrioritySelect.value = task.priority;
    taskDueDateInput.value = task.dueDate || '';
    
    modal.style.display = 'flex';
}

function createTaskCard(task) {
    const li = document.createElement('li');
    li.className = 'task-card';
    li.setAttribute('data-id', task.id);
    
    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;
    
    const desc = document.createElement('div');
    desc.className = 'task-desc';
    desc.textContent = task.description || 'No description';
    
    const priority = document.createElement('span');
    priority.className = `priority-badge priority-${task.priority}`;
    let priorityText = '';
    if (task.priority === 'high') priorityText = '🔴 High';
    else if (task.priority === 'medium') priorityText = '🟡 Medium';
    else priorityText = '🟢 Low';
    priority.textContent = priorityText;
    
    const dueDate = document.createElement('div');
    dueDate.className = 'task-due';
    dueDate.textContent = task.dueDate ? `📅 ${task.dueDate}` : '📅 No due date';
    
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Edit';
    editBtn.className = 'edit-btn';
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', task.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('data-id', task.id);
    
    const btnContainer = document.createElement('div');
    btnContainer.className = 'task-buttons';
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    
    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(priority);
    li.appendChild(dueDate);
    li.appendChild(btnContainer);
    
    setupInlineEditing(li, task.id);
    
    return li;
}

function addTask(columnId, taskData) {
    const newTask = {
        id: Date.now(),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        column: columnId
    };
    
    tasks.push(newTask);
    
    const card = createTaskCard(newTask);
    
    let targetList;
    if (columnId === 'todo') targetList = todoList;
    else if (columnId === 'inprogress') targetList = inProgressList;
    else targetList = doneList;
    
    targetList.appendChild(card);
    updateTaskCounter();
    applyFilter();
}

function deleteTask(taskId) {
    const card = document.querySelector(`.task-card[data-id='${taskId}']`);
    if (!card) return;
    
    card.classList.add('fade-out');
    
    card.addEventListener('animationend', () => {
        card.remove();
        tasks = tasks.filter(t => t.id !== taskId);
        updateTaskCounter();
    }, { once: true });
}

function updateTask(taskId, updatedData) {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return;
    
    tasks[index] = { ...tasks[index], ...updatedData };
    
    const oldCard = document.querySelector(`.task-card[data-id='${taskId}']`);
    if (oldCard) {
        const newCard = createTaskCard(tasks[index]);
        oldCard.replaceWith(newCard);
    }
    
    applyFilter();
}

const lists = [todoList, inProgressList, doneList];
lists.forEach(list => {
    list.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        
        const action = btn.getAttribute('data-action');
        const taskId = parseInt(btn.getAttribute('data-id'));
        
        if (action === 'delete') {
            deleteTask(taskId);
        } else if (action === 'edit') {
            openModalForEdit(taskId);
        }
    });
});

addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const column = btn.getAttribute('data-column');
        openModalForAdd(column);
    });
});

saveBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const taskData = {
        title: title,
        description: taskDescInput.value,
        priority: taskPrioritySelect.value,
        dueDate: taskDueDateInput.value
    };
    
    if (editingTaskId === null) {
        addTask(currentColumn, taskData);
    } else {
        updateTask(editingTaskId, taskData);
    }
    
    closeModal();
});

cancelBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function applyFilter() {
    const selectedPriority = priorityFilter.value;
    const allCards = document.querySelectorAll('.task-card');
    
    allCards.forEach(card => {
        const prioritySpan = card.querySelector('.priority-badge');
        if (!prioritySpan) return;
        
        let cardPriority = '';
        if (prioritySpan.classList.contains('priority-high')) cardPriority = 'high';
        else if (prioritySpan.classList.contains('priority-medium')) cardPriority = 'medium';
        else if (prioritySpan.classList.contains('priority-low')) cardPriority = 'low';
        
        if (selectedPriority === 'all' || cardPriority === selectedPriority) {
            card.classList.remove('is-hidden');
        } else {
            card.classList.add('is-hidden');
        }
    });
}

priorityFilter.addEventListener('change', applyFilter);

clearDoneBtn.addEventListener('click', () => {
    const doneCards = [...doneList.querySelectorAll('.task-card')];
    
    doneCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-out');
            
            card.addEventListener('animationend', () => {
                const taskId = parseInt(card.getAttribute('data-id'));
                card.remove();
                tasks = tasks.filter(t => t.id !== taskId);
                updateTaskCounter();
            }, { once: true });
        }, index * 100);
    });
});

function setupInlineEditing(card, taskId) {
    const titleDiv = card.querySelector('.task-title');
    if (!titleDiv) return;
    
    titleDiv.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        
        const originalTitle = titleDiv.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalTitle;
        input.className = 'inline-input';
        
        titleDiv.replaceWith(input);
        input.focus();
        
        function saveEdit() {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== originalTitle) {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.title = newTitle;
                    const newCard = createTaskCard(task);
                    card.replaceWith(newCard);
                    applyFilter();
                }
            } else {
                const restoredTitle = document.createElement('div');
                restoredTitle.className = 'task-title';
                restoredTitle.textContent = originalTitle;
                input.replaceWith(restoredTitle);
                setupInlineEditing(card, taskId);
            }
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    });
}

const sampleTasks = [
    { title: 'Learn JavaScript', description: 'Complete the Kanban project', priority: 'high', dueDate: '2026-04-20', column: 'todo' },
    { title: 'Style the board', description: 'Make it look beautiful', priority: 'medium', dueDate: '2026-04-18', column: 'inprogress' },
    { title: 'Test all features', description: 'Ensure everything works', priority: 'low', dueDate: '2026-04-22', column: 'done' }
];

sampleTasks.forEach(task => {
    addTask(task.column, task);
});