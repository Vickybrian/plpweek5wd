// =============================================
// PART 1: VARIABLE DECLARATIONS AND CONDITIONALS
// =============================================

// Variable declarations using different methods
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const prioritySelect = document.getElementById('prioritySelect');
const demoOutput = document.getElementById('demoOutput');

let tasks = []; // Array to store all tasks
let taskIdCounter = 1; // Counter for generating unique task IDs

// Statistics variables
let totalTasks = 0;
let completedTasks = 0;
let pendingTasks = 0;

// Object to store priority colors and labels
const priorityConfig = {
    high: { color: 'priority-high', label: 'High' },
    medium: { color: 'priority-medium', label: 'Medium' },
    low: { color: 'priority-low', label: 'Low' }
};

// =============================================
// PART 2: CUSTOM FUNCTIONS
// =============================================

/**
 * Function 1: Add a new task to the task list
 * Demonstrates parameter usage and DOM manipulation
 */
function addTask(taskText, priority = 'medium') {
    // Input validation using conditionals
    if (!taskText || taskText.trim() === '') {
        showDemoOutput('Error: Task text cannot be empty!');
        return false;
    }

    // Create new task object
    const newTask = {
        id: taskIdCounter++,
        text: taskText.trim(),
        priority: priority,
        completed: false,
        createdAt: new Date()
    };

    // Add task to array
    tasks.push(newTask);
    
    // Update statistics
    updateStatistics();
    
    // Render the task list
    renderTaskList();
    
    // Clear input field
    taskInput.value = '';
    
    showDemoOutput(`Task added: "${newTask.text}" (Priority: ${priority})`);
    return true;
}

/**
 * Function 2: Update task statistics
 * Demonstrates function with calculations
 */
function updateStatistics() {
    // Calculate statistics
    totalTasks = tasks.length;
    completedTasks = tasks.filter(task => task.completed).length;
    pendingTasks = totalTasks - completedTasks;
    
    // Update DOM with statistics
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    
    // Conditional styling based on task count
    const totalTasksElement = document.getElementById('totalTasks');
    if (totalTasks > 10) {
        totalTasksElement.style.color = '#e74c3c';
    } else if (totalTasks > 5) {
        totalTasksElement.style.color = '#f39c12';
    } else {
        totalTasksElement.style.color = '#27ae60';
    }
}

// =============================================
// PART 3: LOOP EXAMPLES
// =============================================

/**
 * Loop Example 1: forEach loop to render tasks
 * Demonstrates array iteration and DOM creation
 */
function renderTaskList(filter = 'all') {
    // Clear current task list
    taskList.innerHTML = '';
    
    // Filter tasks based on selection
    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    // Use forEach to iterate through tasks and create DOM elements
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.taskId = task.id;
        
        // Create task content with priority badge
        const priorityInfo = priorityConfig[task.priority];
        taskItem.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-priority ${priorityInfo.color}">${priorityInfo.label}</span>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTaskCompletion(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
    
    // Show message if no tasks
    if (filteredTasks.length === 0) {
        const message = document.createElement('li');
        message.textContent = `No ${filter === 'all' ? '' : filter} tasks found.`;
        message.style.textAlign = 'center';
        message.style.padding = '1rem';
        message.style.color = '#7f8c8d';
        taskList.appendChild(message);
    }
}

/**
 * Loop Example 2: for...of loop to process tasks
 * Demonstrates task processing with conditions
 */
function processHighPriorityTasks() {
    let highPriorityCount = 0;
    let output = 'High Priority Tasks:\n';
    
    // Use for...of loop to iterate through tasks
    for (const task of tasks) {
        if (task.priority === 'high' && !task.completed) {
            highPriorityCount++;
            output += `- ${task.text}\n`;
        }
    }
    
    if (highPriorityCount === 0) {
        output = 'No high priority tasks pending.';
    } else {
        output = `Found ${highPriorityCount} high priority task(s):\n` + output;
    }
    
    showDemoOutput(output);
}

// =============================================
// PART 4: DOM INTERACTIONS
// =============================================

// DOM Interaction 1: Event listener for adding tasks
addTaskBtn.addEventListener('click', function() {
    addTask(taskInput.value, prioritySelect.value);
});

// Also allow adding task with Enter key
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask(taskInput.value, prioritySelect.value);
    }
});

// DOM Interaction 2: Event delegation for filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Render tasks with selected filter
        const filter = this.dataset.filter;
        renderTaskList(filter);
        
        showDemoOutput(`Filtered tasks: ${filter}`);
    });
});

// DOM Interaction 3: Dynamic task actions
function toggleTaskCompletion(taskId) {
    // Find task by ID
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    // Update task completion status
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        updateStatistics();
        renderTaskList(document.querySelector('.filter-btn.active').dataset.filter);
        
        const status = tasks[taskIndex].completed ? 'completed' : 'marked as pending';
        showDemoOutput(`Task "${tasks[taskIndex].text}" ${status}`);
    }
}

function deleteTask(taskId) {
    // Find task by ID
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        const taskText = tasks[taskIndex].text;
        // Remove task from array
        tasks.splice(taskIndex, 1);
        updateStatistics();
        renderTaskList(document.querySelector('.filter-btn.active').dataset.filter);
        
        showDemoOutput(`Task "${taskText}" deleted`);
    }
}

// =============================================
// DEMO FUNCTIONS AND EVENT LISTENERS
// =============================================

// Function to display output in demo area
function showDemoOutput(message) {
    demoOutput.textContent = message;
    demoOutput.scrollTop = demoOutput.scrollHeight;
}

// Demo 1: Variables and Conditionals
document.getElementById('demoVariables').addEventListener('click', function() {
    let output = '=== VARIABLES AND CONDITIONALS DEMO ===\n\n';
    
    // Demonstrate different variable types
    const appName = "Task Manager";
    let userStatus = "active";
    const maxTasks = 20;
    let currentTheme = "light";
    
    output += `App: ${appName}\n`;
    output += `User Status: ${userStatus}\n`;
    output += `Max Tasks: ${maxTasks}\n`;
    output += `Theme: ${currentTheme}\n\n`;
    
    // Demonstrate conditionals
    if (tasks.length > maxTasks / 2) {
        output += "Warning: You have many tasks!\n";
        currentTheme = "warning";
    } else {
        output += "Task load is manageable.\n";
        currentTheme = "normal";
    }
    
    // Switch-like conditional using if-else
    if (tasks.length === 0) {
        output += "No tasks yet. Time to get productive!";
    } else if (tasks.length < 5) {
        output += "Good start! Keep adding tasks.";
    } else if (tasks.length < 10) {
        output += "You're being productive!";
    } else {
        output += "Busy schedule! Consider prioritizing.";
    }
    
    showDemoOutput(output);
});

// Demo 2: Loops
document.getElementById('demoLoops').addEventListener('click', function() {
    let output = '=== LOOP EXAMPLES DEMO ===\n\n';
    
    output += "FOR LOOP (Task IDs):\n";
    // Traditional for loop
    for (let i = 0; i < Math.min(tasks.length, 5); i++) {
        output += `Task ${i + 1}: ID ${tasks[i].id}\n`;
    }
    
    output += "\nFOR...OF LOOP (Task Texts):\n";
    // For...of loop
    let count = 0;
    for (const task of tasks) {
        if (count >= 3) break;
        output += `- ${task.text} [${task.priority}]\n`;
        count++;
    }
    
    output += "\nWHILE LOOP (Statistics):\n";
    // While loop example
    let i = 0;
    let incompleteCount = 0;
    while (i < tasks.length && incompleteCount < 3) {
        if (!tasks[i].completed) {
            output += `Pending: ${tasks[i].text}\n`;
            incompleteCount++;
        }
        i++;
    }
    
    showDemoOutput(output);
});

// Demo 3: Functions
document.getElementById('demoFunctions').addEventListener('click', function() {
    let output = '=== FUNCTIONS DEMO ===\n\n';
    
    // Demonstrate function calls with different parameters
    output += "Function: calculateProductivityScore()\n";
    const score = calculateProductivityScore();
    output += `Productivity Score: ${score}/100\n\n`;
    
    output += "Function: getTaskSummary()\n";
    const summary = getTaskSummary();
    output += summary;
    
    showDemoOutput(output);
});

// Additional custom functions for demo
function calculateProductivityScore() {
    if (tasks.length === 0) return 0;
    
    const completionRate = completedTasks / totalTasks;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    const highPriorityCompleted = tasks.filter(task => 
        task.priority === 'high' && task.completed
    ).length;
    
    let score = completionRate * 70;
    if (highPriorityTasks > 0) {
        score += (highPriorityCompleted / highPriorityTasks) * 30;
    }
    
    return Math.round(score);
}

function getTaskSummary() {
    if (tasks.length === 0) return "No tasks available for summary.";
    
    let summary = `TASK SUMMARY:\n`;
    summary += `Total: ${totalTasks} tasks\n`;
    summary += `Completed: ${completedTasks} tasks\n`;
    summary += `Pending: ${pendingTasks} tasks\n\n`;
    
    // Group tasks by priority
    const tasksByPriority = {
        high: tasks.filter(task => task.priority === 'high'),
        medium: tasks.filter(task => task.priority === 'medium'),
        low: tasks.filter(task => task.priority === 'low')
    };
    
    summary += `BY PRIORITY:\n`;
    for (const priority in tasksByPriority) {
        const priorityTasks = tasksByPriority[priority];
        const completed = priorityTasks.filter(task => task.completed).length;
        summary += `- ${priority.toUpperCase()}: ${priorityTasks.length} tasks (${completed} completed)\n`;
    }
    
    return summary;
}

// Clear all tasks
document.getElementById('clearAll').addEventListener('click', function() {
    if (tasks.length === 0) {
        showDemoOutput('No tasks to clear!');
        return;
    }
    
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        taskIdCounter = 1;
        updateStatistics();
        renderTaskList();
        showDemoOutput('All tasks cleared!');
    }
});

// Initialize the application
function initApp() {
    updateStatistics();
    renderTaskList();
    showDemoOutput('Task Manager initialized!\nUse the buttons above to demo JavaScript features.');
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', initApp);