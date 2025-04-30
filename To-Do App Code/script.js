// Get elements
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  
  // Check if input is empty
  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }
  
  // Create task object
  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };
  
  // Create task element
  const taskItem = document.createElement('li');
  taskItem.className = 'task-item flex justify-between items-center p-3 bg-gray-100 rounded-lg';
  taskItem.innerHTML = `
    <span class="${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} flex-1">${task.text}</span>
    <div class="flex gap-2">
      <button
        onclick="toggleComplete(${task.id})"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ${task.completed ? 'Undo' : 'Complete'}
      </button>
      <button
        onclick="deleteTask(${task.id})"
        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  `;
  taskItem.dataset.id = task.id;
  
  // Add task to list
  taskList.appendChild(taskItem);
  
  // Clear input
  taskInput.value = '';
}

// Function to toggle task completion
function toggleComplete(id) {
  const taskItem = document.querySelector(`[data-id="${id}"]`);
  const span = taskItem.querySelector('span');
  const button = taskItem.querySelector('button');
  
  // Toggle completed state
  const isCompleted = span.classList.contains('line-through');
  if (isCompleted) {
    span.classList.remove('line-through', 'text-gray-500');
    span.classList.add('text-gray-800');
    button.textContent = 'Complete';
    button.classList.remove('bg-gray-500', 'hover:bg-gray-600');
    button.classList.add('bg-green-500', 'hover:bg-green-600');
  } else {
    span.classList.add('line-through', 'text-gray-500');
    span.classList.remove('text-gray-800');
    button.textContent = 'Undo';
    button.classList.remove('bg-green-500', 'hover:bg-green-600');
    button.classList.add('bg-gray-500', 'hover:bg-gray-600');
  }
}

// Function to delete a task
function deleteTask(id) {
  const taskItem = document.querySelector(`[data-id="${id}"]`);
  taskList.removeChild(taskItem);
}

// Add task on Enter key
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});