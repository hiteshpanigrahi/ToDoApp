const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const filterAll = document.getElementById('filterAll');
const filterActive = document.getElementById('filterActive');
const filterCompleted = document.getElementById('filterCompleted');
const modeToggle = document.getElementById('modeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (
            (filterAll.classList.contains('active')) ||
            (filterActive.classList.contains('active') && !task.completed) ||
            (filterCompleted.classList.contains('active') && task.completed)
        ) {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="priority priority-${task.priority}"></div>
                <span class="task-text">${task.text}</span>
                <span class="task-date">${task.date}</span>
                <button class="complete">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete">Delete</button>
            `;
            if (task.completed) {
                li.classList.add('completed');
            }
            li.setAttribute('draggable', true);
            li.addEventListener('dragstart', () => {
                li.classList.add('dragging');
            });
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
            });
            li.querySelector('.complete').addEventListener('click', () => toggleComplete(index));
            li.querySelector('.delete').addEventListener('click', () => deleteTask(index));
            taskList.appendChild(li);
        }
    });
}

function addTask() {
    const text = taskInput.value.trim();
    const date = dateInput.value;
    const priority = priorityInput.value;
    if (text) {
        tasks.push({ text, date, priority, completed: false });
        saveTasks();
        taskInput.value = '';
        dateInput.value = '';
        renderTasks();
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterAll.addEventListener('click', () => {
    filterAll.classList.add('active');
    filterActive.classList.remove('active');
    filterCompleted.classList.remove('active');
    renderTasks();
});

filterActive.addEventListener('click', () => {
    filterAll.classList.remove('active');
    filterActive.classList.add('active');
    filterCompleted.classList.remove('active');
    renderTasks();
});

filterCompleted.addEventListener('click', () => {
    filterAll.classList.remove('active');
    filterActive.classList.remove('active');
    filterCompleted.classList.add('active');
    renderTasks();
});

modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    modeToggle.innerHTML = document.body.classList.contains('dark-mode')
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
});

taskList.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        taskList.appendChild(draggable);
    } else {
        taskList.insertBefore(draggable, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

renderTasks();