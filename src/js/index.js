
document.addEventListener('DOMContentLoaded', function () {
    const inputBox = document.getElementById('taskInput');
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskForm = document.getElementById('taskForm');

    // Load tasks from local storage on page load
    loadTasksFromLocalStorage();

    addTaskButton.addEventListener('click', function () {
        addTask();
    });

    function addTask() {
        if (inputBox.value.trim() === '') {
            alert('Please enter text');
        } else {
            let li = document.createElement('li');

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', function () {
                markCompleted(li, checkbox.checked);
            });

            li.appendChild(checkbox);

            li.innerHTML += inputBox.value;

            let editIcon = createIcon('fa fa-edit', 'Edit Task', function () {
                editTask(li);
            });

            let deleteIcon = createIcon('fa fa-trash', 'Delete Task', function () {
                deleteTask(li);
            });

            li.appendChild(editIcon);
            li.appendChild(deleteIcon);
            taskList.appendChild(li);

            updateLocalStorage(); // Update local storage after adding a task
        }
        inputBox.value = '';
    }

    function deleteTask(taskItem) {
        taskItem.remove();
        updateLocalStorage(); // Update local storage after deleting a task
    }

    function editTask(taskItem) {
        // Replace the task text with an editable input field and a save button
        let inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = taskItem.textContent.trim();

        let saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', function () {
            saveTask(taskItem, inputField.value);
        });

        taskItem.innerHTML = ''; // Clear the existing content

        // Create a checkbox
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = taskItem.classList.contains('completed');
        checkbox.addEventListener('change', function () {
            markCompleted(taskItem, checkbox.checked);
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(inputField);
        taskItem.appendChild(saveButton);
        inputField.focus(); // Focus on the input field
    }

    function saveTask(taskItem, newText) {
        // Update the task text and remove the input field and save button
        taskItem.innerHTML = '';

        // Create a checkbox
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function () {
            markCompleted(taskItem, checkbox.checked);
        });

        taskItem.appendChild(checkbox);

        // Create a span for the task text
        let span = document.createElement('span');
        span.textContent = newText;

        // Add edit and delete icons
        let editIcon = createIcon('fa fa-edit', 'Edit Task', function () {
            editTask(taskItem);
        });

        let deleteIcon = createIcon('fa fa-trash', 'Delete Task', function () {
            deleteTask(taskItem);
        });

        taskItem.appendChild(span);
        taskItem.appendChild(editIcon);
        taskItem.appendChild(deleteIcon);

        updateLocalStorage(); // Update local storage after saving an edit
    }

    function markCompleted(taskItem, completed) {
        if (completed) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
        updateLocalStorage(); // Update local storage after marking as completed
    }

    function createIcon(iconClass, label, clickHandler) {
        let icon = document.createElement('i');
        icon.className = iconClass;
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('aria-label', label);
        icon.addEventListener('click', clickHandler);
        return icon;
    }

    function updateLocalStorage() {
        // Get current task texts and completion status from the list
        let tasks = Array.from(taskList.children).map(task => {
            return {
                text: task.querySelector('span').textContent.trim(),
                completed: task.classList.contains('completed'),
            };
        });

        // Save tasks to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log('Updated local storage:', tasks);
    }

    function loadTasksFromLocalStorage() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Create li elements for each task
        tasks.forEach(task => {
            let li = document.createElement('li');

            // Create a checkbox
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function () {
                markCompleted(li, checkbox.checked);
            });

            li.appendChild(checkbox);

            // Create a span for the task text
            let span = document.createElement('span');
            span.textContent = task.text;

            li.appendChild(span);

            let editIcon = createIcon('fa fa-edit', 'Edit Task', function () {
                editTask(li);
            });

            let deleteIcon = createIcon('fa fa-trash', 'Delete Task', function () {
                deleteTask(li);
            });

            li.appendChild(editIcon);
            li.appendChild(deleteIcon);

            // Mark as completed if needed
            if (task.completed) {
                li.classList.add('completed');
            }

            taskList.appendChild(li);
        });
    }

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addTask();
    });
});




