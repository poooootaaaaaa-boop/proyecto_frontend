import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/global.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter } from "react-router-dom";

// 👇 IMPORTA ESTO
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LocalizationProvider>
  </StrictMode>,
);