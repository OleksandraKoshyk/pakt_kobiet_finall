export function loadTasksFromLokalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
  for (const day in tasks) {
      tasks[day].forEach(task => {
          addTask(day, task.text, task.completed);
      });
  }
}

export function addTask(day, taskText, completed = false) {
  const tasksList = document.getElementById(`tasks-${day}`);
  if (!tasksList) return;

  const taskItem = document.createElement('li');

  // Lewa część zadania - checkbox
  const taskLeftDiv = document.createElement('div');
  taskLeftDiv.classList.add('task-left');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.classList.add('form-check-input');
  checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
          taskTextSpan.classList.add('completed');
          updateTaskStatus(day, taskText, true);
      } else {
          taskTextSpan.classList.remove('completed');
          updateTaskStatus(day, taskText, false);
      }
  });

  taskLeftDiv.appendChild(checkbox);


  // Środkowa część zadania - tekst
  const taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;
  if (completed) {
      taskTextSpan.classList.add('completed');
  }

  // Prawa część zadania - przycisk usuwania
  const taskRightDiv = document.createElement('div');
  taskRightDiv.classList.add('task-right');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn-close');
  deleteButton.setAttribute('aria-label', 'Close')
  deleteButton.addEventListener('click', () => {
      removeTask(day, taskText);
  });

  taskRightDiv.appendChild(deleteButton);

  // Złożenie elementów w liście
  taskItem.appendChild(taskLeftDiv);
  taskItem.appendChild(taskTextSpan);
  taskItem.appendChild(taskRightDiv);

  tasksList.appendChild(taskItem);

  // Zapisanie zadania w localStorage
}

function removeTask(day, taskText) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
  if (tasks[day]) {
      tasks[day] = tasks[day].filter(task => task.text !== taskText);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      // Odświeżenie listy zadań
      removeTaskFromDom(day, taskText)
    }
}

function removeTaskFromDom(day, taskText) {
  const tasksList = document.getElementById(`tasks-${day}`);
  if (!tasksList) return;
  
  for (const task of tasksList.children) {
    if (task.children[1].textContent === taskText) {
      task.remove();
    }
  }
 }

function updateTaskStatus(day, taskText, completed) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
  if (tasks[day]) {
      tasks[day] = tasks[day].map(task => {
          if (task.text === taskText) {
              return { text: task.text, completed: completed };
          }
          return task;
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

export function saveTaskToLocalStarage(day, taskText, completed = false) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
  if (!tasks[day]) {
      tasks[day] = [];
  }
  tasks[day].push({ text: taskText, completed: completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}