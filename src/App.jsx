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
// 1. IMPORTACIONES AL INICIO DEL ARCHIVO (Asegúrate de que las rutas coincidan con tus carpetas reales)
import Doctors from "./pages/farmacia/Doctors"; // <-- AGREGA ESTA LÍNEA (Ajusta la ruta de tu carpeta)
import ClinicAttendance from "./pages/farmacia/ClinicAttendance";
import DoctorAttendance from "./pages/Medicos/DoctorAttendance";

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
import DoctorInfo from "./components/registros/DoctorInfo";
import ClinicInfo from "./components/registros/ClinicInfo";
import FinishRegister from "./components/registros/FinishRegister";
import "bootstrap-icons/font/bootstrap-icons.css";


export default function App() {
  return (

    <AppointmentProvider>
      <Routes>
        <Route path="/Dashboard_paciente" element={<Dashboard />} />
        <Route path="/recuperar" element={<ForgotPassword />} />
        <Route path="/seleccionar_perfil" element={<SelectProfile />} />
        <Route path="/registro/doctor" element={<DoctorInfo />} />
        <Route path="/registro/clinic" element={<ClinicInfo />} />
        <Route path="/registro/finish" element={<FinishRegister />} />

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
            {/* Módulo de Doctores (Gestión, edición y marcaje rápido) */}

        {/* Módulo de Clínica (Historial global y filtros de fechas) */}
        <Route path="/clinica/asistencias" element={<ClinicAttendance />} />

        {/* Módulo de Autogestión del Doctor (Reloj y marcaje personal) */}
        <Route path="/doctor/asistencia" element={<DoctorAttendance />} />

      </Routes>
    </AppointmentProvider>
  );
}