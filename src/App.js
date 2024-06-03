import React, { useState, useEffect } from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import './App.css';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Footer from './components/Footer'; // Import Footer

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [userLanguage, setUserLanguage] = useState('en');
  const [hasCreatedTask, setHasCreatedTask] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const isNewUser = localStorage.getItem('hasSeenTour') !== 'true';

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('taskList')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
    setHasCreatedTask(true);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleTaskUpdate = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  const startTour = (language) => {
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'custom-tour-class',
        scrollTo: { behavior: 'smooth', block: 'center' }
      }
    });

    const steps = {
      en: [
        { id: 'welcome', text: 'Welcome to TaskMaster! Let us give you a quick tour.', attachTo: { element: '.welcome-section', on: 'bottom' } },
        { id: 'create-task', text: 'Here you can create a new task.', attachTo: { element: '.create-task-button', on: 'right' } },
        { id: 'task-list', text: 'Here you can see and manage your tasks.', attachTo: { element: '.task-list', on: 'top' } }
      ],
      hn: [
        { id: 'welcome', text: 'कार्य-प्रबंधक में आपका स्वागत है! आइए हम आपको एक त्वरित भ्रमण कराते हैं।', attachTo: { element: '.welcome-section', on: 'bottom' } },
        { id: 'create-task', text: 'यहां आप नया टास्क बना सकते हैं.', attachTo: { element: '.create-task-button', on: 'right' } },
        { id: 'task-list', text: 'यहां आप अपने कार्यों को देख और प्रबंधित कर सकते हैं।', attachTo: { element: '.task-list', on: 'top' } }
      ],
      es: [
        { id: 'welcome', text: '¡Bienvenido a TaskMaster! Permítanos darle un recorrido rápido.', attachTo: { element: '.welcome-section', on: 'bottom' } },
        { id: 'create-task', text: 'Aquí puedes crear una nueva tarea.', attachTo: { element: '.create-task-button', on: 'right' } },
        { id: 'task-list', text: 'Aquí puedes ver y administrar tus tareas.', attachTo: { element: '.task-list', on: 'top' } }
      ]
    };

    steps[language].forEach(step => {
      tour.addStep({
        id: step.id,
        text: step.text,
        attachTo: step.attachTo,
        buttons: [
          {
            text: 'Back',
            action: tour.back,
            classes: step.id === 'welcome' ? 'hidden' : ''
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      });
    });

    tour.on('complete', () => {
      localStorage.setItem('hasSeenTour', 'true');
    });

    tour.on('cancel', () => {
      localStorage.setItem('hasSeenTour', 'true');
    });

    tour.start();
  };

  useEffect(() => {
    if (isNewUser) {
      startTour(userLanguage);
    }
  }, [isNewUser, userLanguage]);

  useEffect(() => {
    if (hasCreatedTask) {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          cancelIcon: {
            enabled: true
          },
          classes: 'custom-tour-class',
          scrollTo: { behavior: 'smooth', block: 'center' }
        }
      });

      tour.addStep({
        id: 'feedback',
        text: 'We would love to hear your feedback about this tour and Task!',
        buttons: [
          {
            text: 'Submit Feedback',
            action: () => {
              const feedback = prompt('Please provide your feedback:');
              if (feedback) {
                console.log('Feedback Submitted:', feedback);
              }
              tour.complete();
            }
          }
        ]
      });

      tour.start();
    }
  }, [hasCreatedTask]);

  const handleReTour = () => {
    localStorage.setItem('hasSeenTour', 'false');
    startTour(userLanguage);
  };

  return (
    <div className="App">
      <Header />
      <div className="language-selector">
        <button onClick={() => setShowLanguageSelector(!showLanguageSelector)}>Select Language</button>
        {showLanguageSelector && (
          <div className="language-options">
            <label htmlFor="language">Select Language: </label>
            <select id="language" value={userLanguage} onChange={(e) => setUserLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="hn">हिंदी</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        )}
      </div>
      <button className="retour-button" onClick={handleReTour}>Re-Tour</button>
      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} onTaskDelete={deleteTask} onTaskUpdate={handleTaskUpdate} />
      <Footer /> 
    </div>
  );
};

export default App;
