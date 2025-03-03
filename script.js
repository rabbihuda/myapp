document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    setupDarkMode();
});

// Load tasks from LocalStorage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let filter = document.getElementById("filter").value;

    let filteredTasks = tasks.filter(task => {
        if (filter === "all") return true;
        if (filter === "in-progress") return !task.completed && task.startDate;
        if (filter === "completed") return task.completed;
    });

    document.getElementById("task-list").innerHTML = "";
    filteredTasks.forEach((task, index) => displayTask(task, index));
}

// Function to display a task
function displayTask(task, index) {
    const list = document.getElementById("task-list");
    const li = document.createElement("li");

    li.innerHTML = `
        <span class="task-text ${task.completed ? 'completed' : ''}" onclick="toggleTask(${index})">
            ${task.url ? `<a href="${task.url}" target="_blank">${task.text}</a>` : task.text}
        </span>
        <div class="task-status">
            ${task.startDate ? `<p>Started: ${task.startDate}</p>` : ""}
            ${task.completed ? `<p>Finished: ${task.finishDate}</p>` : ""}
        </div>
        <div class="task-buttons">
            <button onclick="toggleTask(${index})">${task.completed ? 'Undo' : 'Done'}</button>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        </div>
    `;
    
    list.appendChild(li);
}

// Function to add a new task
/*function addTask() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskText = document.getElementById("new-task").value.trim();
    let taskUrl = document.getElementById("task-url").value.trim();

    if (taskText === "") {
        alert("Please enter a valid task.");
        return;
    }

    tasks.push({ text: taskText, url: taskUrl, completed: false, startDate: null, finishDate: null });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    loadTasks();
}*/

// Function to add a new task with validation
function addTask() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskText = document.getElementById("new-task").value.trim();
    let taskUrl = document.getElementById("task-url").value.trim();

    // Task text validation
    if (taskText === "") {
        alert("Please enter a valid task.");
        return;
    }

    // Check for duplicate task
    if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
        alert("This task already exists.");
        return;
    }

    // URL validation (if provided)
    if (taskUrl && !isValidURL(taskUrl)) {
        alert("Please enter a valid URL.");
        return;
    }

    // Add new task
    tasks.push({ text: taskText, url: taskUrl, completed: false, startDate: null, finishDate: null });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById("new-task").value = ""; // Clear input after adding
    document.getElementById("task-url").value = ""; // Clear URL input
    loadTasks();
}

// Function to validate URL
function isValidURL(url) {
    let pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w]+(\/[\w\d-]*)*\/?$/;
    return pattern.test(url);
}

// Toggle task completion
function toggleTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let currentDate = new Date().toLocaleDateString();

    if (!tasks[index].completed) {
        if (!tasks[index].startDate) tasks[index].startDate = currentDate;
        tasks[index].finishDate = currentDate;
    } else {
        tasks[index].startDate = null;
        tasks[index].finishDate = null;
    }

    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// Delete a task
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// Upload JSON file
function uploadJSON() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        localStorage.setItem("tasks", event.target.result);
        loadTasks();
    };
    reader.readAsText(fileInput.files[0]);
}

// Download JSON file
function downloadJSON() {
    const tasks = localStorage.getItem("tasks");
    const blob = new Blob([tasks], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function setupDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const isDarkMode = localStorage.getItem("darkMode") === "enabled";

  if (isDarkMode) document.body.classList.add("dark-mode");

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
  });
}
