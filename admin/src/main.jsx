import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider, { AppContext } from "./context/AppContext.jsx";
import AdminContextProvider, { AdminContext }  from './context/AdminContext.jsx';
import TutorContextProvider, { TutorContext } from "./context/TutorContext.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <AdminContextProvider>
        <TutorContextProvider>
          <App />
        </TutorContextProvider>
      </AdminContextProvider>
    </AppContextProvider>
  </BrowserRouter>
)
