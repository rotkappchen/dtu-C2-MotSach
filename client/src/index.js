import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import DataProvider0 from './redux/store';
import SettingsContextProvider from './components/body/pomodoro/SettingsContext';
import { DataProvider } from './GlobalState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  
    <DataProvider>
      <DataProvider0>
      <SettingsContextProvider>
      <App />
      </SettingsContextProvider>
      </DataProvider0>
    </DataProvider>

    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
