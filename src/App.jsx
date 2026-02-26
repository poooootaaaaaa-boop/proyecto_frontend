import { Routes, Route } from "react-router-dom";
import FarmaciaRoutes from "./routes/FarmaciaRoutes";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Treatments from "./pages/Treatments";
import NewAppointment from "./components/appointments/NewAppointment";
import ConfirmAppointment from "./components/appointments/ConfirmAppointment";
import { AppointmentProvider } from "./components/appointments/AppointmentContext";
import Layout_Medicos from "./Medicos/Layout_Medicos";
import Dashboard_medicos from "./Medicos/Dashboard_medicos";
import Lista_paciente from "./Medicos/lista_paciente";
import Recetas_medicas from "./Medicos/recetas_medicas"
export default function App() {

  return (
    <AppointmentProvider>
    <Routes>


      <Route path="/" element={<Dashboard />} />

      <Route path="/angelito-cachondo" element={<Layout_Medicos />} />
      <Route path="/recetas_medicas" element={<Recetas_medicas />} />
      <Route path="/lista_paciente" element={<Lista_paciente />} />
      <Route path="/Dashboard_medicos" element={<Dashboard_medicos />} />
      <Route path="/citas" element={<Appointments />} />
      <Route path="/nueva-cita" element={<NewAppointment />} />
      <Route path="/confirmar-cita" element={<ConfirmAppointment />} />

      <Route path="/tratamientos" element={<Treatments />} />
      <Route path="/farmacia/*" element={<FarmaciaRoutes/>} />
    </Routes>
    </AppointmentProvider>
  );

}