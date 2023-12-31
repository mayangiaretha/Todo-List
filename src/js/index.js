document.addEventListener("DOMContentLoaded", function () {
  const inputBox = document.getElementById("taskInput");
  const taskList = document.getElementById("task-list");
  const addTaskButton = document.getElementById("addTaskButton");
  const taskForm = document.getElementById("taskForm");

  loadTasksFromLocalStorage();

  addTaskButton.addEventListener("click", function () {
    addTask();
  });

  function addTask() {
    if (inputBox.value.trim() === "") {
      alert("Please enter text");
    } else {
      let li = document.createElement("li");

      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", function () {
        markCompleted(li, checkbox.checked);
      });

      li.appendChild(checkbox);

      let span = document.createElement("span");
      span.textContent = inputBox.value;

      li.appendChild(span);

      let editIcon = createIcon("fa fa-edit", "Edit Task", function () {
        editTask(li);
      });

      let deleteIcon = createIcon("fa fa-trash", "Delete Task", function () {
        deleteTask(li);
      });

      li.appendChild(editIcon);
      li.appendChild(deleteIcon);
      taskList.appendChild(li);

      updateLocalStorage();
    }
    inputBox.value = "";
  }

  function deleteTask(taskItem) {
    taskItem.remove();
    updateLocalStorage();
  }

  function editTask(taskItem) {
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskItem.textContent.trim();

    let saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", function () {
      saveTask(taskItem, inputField.value);
    });

    taskItem.innerHTML = ""; // Clear the existing content

    // Create a checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskItem.classList.contains("completed");
    checkbox.addEventListener("change", function () {
      markCompleted(taskItem, checkbox.checked);
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(inputField);
    taskItem.appendChild(saveButton);
    inputField.focus();
  }

  function saveTask(taskItem, newText) {
    taskItem.innerHTML = "";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function () {
      markCompleted(taskItem, checkbox.checked);
    });

    taskItem.appendChild(checkbox);

    // Create a span for the task text
    let span = document.createElement("span");
    span.textContent = newText;

    // Add edit and delete icons
    let editIcon = createIcon("fa fa-edit", "Edit Task", function () {
      editTask(taskItem);
    });

    let deleteIcon = createIcon("fa fa-trash", "Delete Task", function () {
      deleteTask(taskItem);
    });

    taskItem.appendChild(span);
    taskItem.appendChild(editIcon);
    taskItem.appendChild(deleteIcon);

    updateLocalStorage();
  }

  function markCompleted(taskItem, completed) {
    if (completed) {
      taskItem.classList.add("completed");
    } else {
      taskItem.classList.remove("completed");
    }
    updateLocalStorage();
  }

  function createIcon(iconClass, label, clickHandler) {
    let icon = document.createElement("i");
    icon.className = iconClass;
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("aria-label", label);
    icon.addEventListener("click", clickHandler);
    return icon;
  }

  function updateLocalStorage() {
    let tasks = Array.from(taskList.children).map((task) => {
      return {
        text: task.querySelector("span").textContent.trim(),
        completed: task.classList.contains("completed"),
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task) => {
      let li = document.createElement("li");

      // Create a checkbox
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", function () {
        markCompleted(li, checkbox.checked);
      });

      li.appendChild(checkbox);

      let span = document.createElement("span");
      span.textContent = task.text;

      li.appendChild(span);

      let editIcon = createIcon("fa fa-edit", "Edit Task", function () {
        editTask(li);
      });

      let deleteIcon = createIcon("fa fa-trash", "Delete Task", function () {
        deleteTask(li);
      });

      li.appendChild(editIcon);
      li.appendChild(deleteIcon);

      if (task.completed) {
        li.classList.add("completed");
      }

      taskList.appendChild(li);
    });
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTask();
  });
});
