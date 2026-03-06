import { Routes, Route } from "react-router-dom";
import FarmaciaRoutes from "./routes/FarmaciaRoutes";
import MedicosRoute from "./routes/MedicosRoutes"; // Esto es lo que trajo el equipo
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Treatments from "./pages/Treatments";
import NewAppointment from "./components/appointments/NewAppointment";
import ConfirmAppointment from "./components/appointments/ConfirmAppointment";
import { AppointmentProvider } from "./components/appointments/AppointmentContext";
import SelectProfile from "./components/registros/SelectProfile";


// Tus rutas y componentes del stash
import Layout_Medicos from "./pages/Medicos/Layout_Medicos";
import Dashboard_medicos from "./pages/Medicos/Dashboard_medicos";
import Lista_paciente from "./pages/Medicos/lista_paciente";
import Recetas_medicas from "./pages/Medicos/recetas_medicas";
import HistorialMedico from "./components/historiapaciente/HistorialMedico";
import Layout from "./components/layout/Layout";
import PerfilPremium from "./components/PerfilEdit/PerfilPremium";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./components/Home/Home";


export default function App() {
  return (

    <AppointmentProvider>
      <Routes>
        <Route path="/Dashboard_paciente" element={<Dashboard />} />
        <Route path="/recuperar" element={<ForgotPassword />} />
        <Route path="/seleccionar_perfil" element={<SelectProfile />} />





        {/* Tus rutas nuevas */}
        <Route path="/angelito-cachondo" element={<Layout_Medicos />} />
        <Route path="/recetas_medicas" element={<Recetas_medicas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/historial_medico"
          element={
            <Layout>
              <HistorialMedico />
            </Layout>
          }
        />
        <Route
          path="/perfil_edit"
          element={
            <Layout>
              <PerfilPremium />
            </Layout>
          }
        />

        <Route path="/lista_paciente" element={<Lista_paciente />} />
        <Route path="/Dashboard_medicos" element={<Dashboard_medicos />} />

        {/* Rutas generales y del equipo */}
        <Route path="/citas" element={<Appointments />} />
        <Route path="/nueva-cita" element={<NewAppointment />} />
        <Route path="/confirmar-cita" element={<ConfirmAppointment />} />
        <Route path="/tratamientos" element={<Treatments />} />
        <Route path="/farmacia/*" element={<FarmaciaRoutes />} />
        <Route path="/Medicos/*" element={<MedicosRoute />} />
      </Routes>
    </AppointmentProvider>
  );
}