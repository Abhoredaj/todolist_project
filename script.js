// Wait for the DOM content to load before running the code
document.addEventListener('DOMContentLoaded', function () {
  // Get references to various elements in the HTML
  const input = document.getElementById('newTaskInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const todoList = document.getElementById('todoList');
  const deleteAllButton = document.getElementById('deleteAllButton');
  const deleteSelectedButton = document.getElementById('deleteSelectedButton');
  const allButton = document.getElementById('all');
  const completedButton = document.getElementById('completed');
  const remainingButton = document.getElementById('remaining');
  const taskCount = document.getElementById('taskCount');
  const completedCount = document.getElementById('completedCount');
  const remainingCount = document.getElementById('remainingCount');

  // Initialize an empty array to store tasks
  let tasks = [];

  // Function to create a new task element and return the <li> element
  function createTaskElement(task, taskId) {
    const li = document.createElement('li');
    li.dataset.taskId = taskId;
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox">
      <span style="font-family: 'Poppins', sans-serif;">${task}</span>
      <button class="delete-button"><i class="bx bx-trash"></i></button>
    `;

    // Get the checkbox element and set its checked state based on task completion
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.checked = tasks[taskId].completed;

    // Add an event listener to the checkbox to toggle the completion status
    checkbox.addEventListener('change', function (event) {
      event.stopPropagation();
      tasks[taskId].completed = checkbox.checked;
      updateTaskList();
    });

    // Get the delete button element and add an event listener to delete the task
    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteTask(taskId);
    });

    // If the task is completed, add the 'completed' class to the <li> element
    if (tasks[taskId].completed) {
      li.classList.add('completed');
    }

    return li;
  }

  // Function to create a new task element and return the <li> element for the remaining and completion filters
  function createFilterTaskElement(task, taskId) {
    const li = document.createElement('li');
    li.dataset.taskId = taskId;
    li.innerHTML = `
      <span style="font-family: 'Poppins', sans-serif;">${task}</span>
    `;

    return li;
  }

  // Function to update the task list in the HTML
  function updateTaskList() {
    todoList.innerHTML = '';
    let completedTasksCount = 0;

    // Loop through all tasks and create the corresponding task elements
    tasks.forEach((task, taskId) => {
      const taskElement = createTaskElement(task.text, taskId);

      // If the task is completed, add the 'completed' class and check the checkbox
      if (task.completed) {
        taskElement.classList.add('completed');
        taskElement.querySelector('.task-checkbox').checked = true;
        completedTasksCount++;
      }

      // Append the task element to the todoList
      todoList.appendChild(taskElement);
    });

    // Calculate the number of remaining tasks and completed tasks
    const remainingTasksCount = tasks.length - completedTasksCount;
    completedCount.textContent = completedTasksCount.toString();
    remainingCount.textContent = remainingTasksCount.toString();
  }

  // Function to check if a task with the same text already exists in the task list
  function isTaskAlreadyAdded(taskText) {
    return tasks.some((task) => task.text.toLowerCase() === taskText.toLowerCase());
  }

  // Function to add a new task to the task list
  function addTask() {
    const taskText = input.value.trim();
    if (taskText === '') return;

    // Check if the task is already in the list and show a confirmation message
    if (isTaskAlreadyAdded(taskText)) {
      const confirmAdd = confirm('The task is already in the list. Do you still want to add it?');
      if (!confirmAdd) {
        input.value = '';
        return;
      }
    }

    // Add the new task to the tasks array and update the task list in the HTML
    tasks.push({ text: taskText, completed: false });
    input.value = '';
    updateTaskList();
    updateTaskCount();

    // Set the 'All' button as active and reset the other filter buttons
    allButton.classList.add('active');
    completedButton.classList.remove('active');
    remainingButton.classList.remove('active');
  }

  // Function to delete a task from the task list
  function deleteTask(taskId) {
    tasks.splice(taskId, 1);
    updateTaskList();
    updateTaskCount();
  }

  // Function to toggle the completion status of a task
  function toggleTaskCompletion(taskId) {
    if (taskId >= 0 && taskId < tasks.length) {
      tasks[taskId].completed = !tasks[taskId].completed;
      updateTaskList();
    } else {
      console.error("Invalid taskId:", taskId);
    }
  }

  // Function to delete all tasks from the task list
  function deleteAllTasks() {
    if (tasks.length > 0) {
      const confirmDelete = confirm("Are you sure you want to delete all tasks?");
      if (!confirmDelete) {
        return;
      }
    }
    tasks = [];
    updateTaskList();
    updateTaskCount();
  }

  // Function to delete all completed tasks from the task list
  function deleteSelectedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    updateTaskList();
    updateTaskCount();
    allButton.classList.add('active');
    completedButton.classList.remove('active');
    remainingButton.classList.remove('active');
  }

  // Add an event listener to the 'Add' button to add a new task
  addTaskButton.addEventListener('click', addTask);

  // Add an event listener to the todoList to handle task deletion and completion
  todoList.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('delete-button')) {
      event.stopPropagation();
      const li = target.closest('li');
      const taskId = li.dataset.taskId;
      deleteTask(taskId);
    } else if (target.classList.contains('task-checkbox')) {
      const li = target.closest('li');
      const taskId = li.dataset.taskId;
      toggleTaskCompletion(taskId);
    }
  });

  // Add an event listener to the 'Delete All' button to delete all tasks
  deleteAllButton.addEventListener('click', deleteAllTasks);

  // Add an event listener to the 'Delete Selected' button to delete completed tasks
  deleteSelectedButton.addEventListener('click', deleteSelectedTasks);

  // Add an event listener to the 'All' button to show all tasks
  allButton.addEventListener('click', function () {
    updateTaskList();
    allButton.classList.add('active');
    completedButton.classList.remove('active');
    remainingButton.classList.remove('active');
  });

  // Function to show only completed tasks
  function showCompletedTasks() {
    const completedTasks = tasks.filter((task) => task.completed);
    todoList.innerHTML = '';

    completedTasks.forEach((task, index) => {
      const taskElement = createFilterTaskElement(task.text, index); // Use the index as the taskId
      taskElement.classList.add('completed');
      todoList.appendChild(taskElement);
    });

    allButton.classList.remove('active');
    completedButton.classList.add('active');
    remainingButton.classList.remove('active');
  }

  // Function to show only remaining tasks
  function showRemainingTasks() {
    const remainingTasks = tasks.filter((task) => !task.completed);
    todoList.innerHTML = '';

    remainingTasks.forEach((task, index) => {
      const taskElement = createFilterTaskElement(task.text, index); // Use the index as the taskId
      todoList.appendChild(taskElement);
    });

    allButton.classList.remove('active');
    completedButton.classList.remove('active');
    remainingButton.classList.add('active');
  }

  // Function to update the task count in the HTML
  function updateTaskCount() {
    taskCount.textContent = tasks.length.toString();
  }

  // Add an event listener to the 'Completed' button to show completed tasks
  completedButton.addEventListener('click', showCompletedTasks);

  // Add an event listener to the 'Remaining' button to show remaining tasks
  remainingButton.addEventListener('click', showRemainingTasks);

  // Update the task list and count when the page is loaded
  updateTaskList();
});
