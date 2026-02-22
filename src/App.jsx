import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Treatments from "./pages/Treatments";
import NewAppointment from "./components/appointments/NewAppointment";
import ConfirmAppointment from "./components/appointments/ConfirmAppointment";
import { AppointmentProvider } from "./components/appointments/AppointmentContext";

export default function App() {

  return (
    <AppointmentProvider>
    <Routes>

      <Route path="/" element={<Dashboard />} />

      <Route path="/citas" element={<Appointments />} />
      <Route path="/nueva-cita" element={<NewAppointment />} />
      <Route path="/confirmar-cita" element={<ConfirmAppointment />} />

      <Route path="/tratamientos" element={<Treatments />} />

    </Routes>
    </AppointmentProvider>
  );

}