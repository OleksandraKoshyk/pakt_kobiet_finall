

import { getUserCoords } from './modules/getUserCoords'
import { fetchWeatherData, processWeatherData } from './modules/weather';
import { loadTasksFromLokalStorage, saveTaskToLocalStarage, addTask } from './modules/tasks';

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

async function initializeApp() {
  removePastTasks();

  try {
    const coords = await getUserCoords();

    console.log('coords from getUserCoords:', coords);
    
    
    const weatherData = await fetchWeatherData(coords[0], coords[1]); 
    displayCity(weatherData.city.name);
    createToDoLists(processWeatherData(weatherData));
  } catch (error) {
    console.error('Błąd inicjalizacji aplikacji:', error);
  }
}

function removePastTasks() {
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

  console.log('tasks from localStorage.parse:', tasks);
  
  let tasksRemoved = false;
  for (const day in tasks) {
    if (day < currentDate) {
      delete tasks[day];
      tasksRemoved = true;
    }
  }

  if (tasksRemoved) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
} 


//
function displayCity(city) {
  const cityDisplay = document.getElementById('current-city');
  cityDisplay.textContent = city;
}


function createToDoLists(weatherData) {
  const todolistsContainer = document.getElementById('todolists');
  todolistsContainer.innerHTML = ''; // Czyści poprzednie listy

  weatherData.forEach(dayData => {
    const todolistDiv = document.createElement('div');
    todolistDiv.classList.add('todolist');

      // Nagłówek z datą
    const title = document.createElement('h2');
    title.textContent = capitalizeFirstLetter(dayData.date);
    todolistDiv.appendChild(title);
    

      // Sekcja pogodowa z ikoną
    const weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather');

    const weatherDetailsDiv = document.createElement('div');
    weatherDetailsDiv.classList.add('weather-details');

    const weatherIcon = document.createElement('img');
    weatherIcon.src = dayData.icon;
    weatherIcon.alt = dayData.weather;
    weatherIcon.className ='img-fluid';

    const weatherInfo = document.createElement('div');
    weatherInfo.innerHTML = `
          <span>Temperatura: ${dayData.temperature} &deg;C</span><br>
          <span>Pogoda: ${capitalizeFirstLetter(dayData.weather)}</span><br>
          <span>Wschód: ${dayData.sunrise}</span><br>
          <span>Zachód: ${dayData.sunset}</span>
      `;

    weatherDetailsDiv.appendChild(weatherIcon);
    weatherDetailsDiv.appendChild(weatherInfo);
    weatherDiv.appendChild(weatherDetailsDiv);
    todolistDiv.appendChild(weatherDiv);

    // Lista zadań
    const tasksList = document.createElement('ul');
    tasksList.classList.add('tasks');
    tasksList.id = `tasks-${dayData.fullDate}`;
    todolistDiv.appendChild(tasksList);

    // Formularz dodawania zadań
    const addTaskForm = document.createElement('form');
    addTaskForm.classList.add('add-task-form');
    addTaskForm.innerHTML = `
        <input type="text" placeholder="Nowe zadanie" class="form-control" required>
        <button type="submit" class="btn btn-warning px-5">Dodaj</button>
    `;
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = addTaskForm.querySelector('input');
        const taskText = input.value.trim();
        if (taskText !== '') {
          addTask(dayData.fullDate, taskText, false);
          saveTaskToLocalStarage(dayData.fullDate, taskText)
            input.value = '';
        }
    });
    todolistDiv.appendChild(addTaskForm);

    todolistsContainer.appendChild(todolistDiv);
  });
  loadTasksFromLokalStorage();
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
