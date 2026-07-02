import { Link } from "react-router-dom";
import Layout_Medicos from "./Layout_Medicos";
import { colors } from "@mui/material";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {  CardContent, Typography,Chip} from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import "./Tablas.css";
import "./card.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TablePagination from '@mui/material/TablePagination';
import MedicationIcon from '@mui/icons-material/Medication';
import Axios from "axios";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;
function Dashboard_medicos(/*{citas consultas=[]}*/) {

  const [citas, setCitas] = useState([]);
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);

  const [consultas, setConsultas] = useState([]);
const [usuario, setUsuario] = useState(null);

useEffect(() => {
  const userStorage = localStorage.getItem("usuario");

  if (userStorage) {
    setUsuario(JSON.parse(userStorage));
  }
}, []);
  useEffect(() => {
  Axios.get(`${API_URL}/MostrarConsulta`)
    .then((res) => {
      setConsultas(res.data);
    })
    .catch((error) => {
      console.error("Error cargando consultas:", error);
    });
}, []);

useEffect(() => {
  const doctor_id = 1;

  Axios.get(`${API_URL}/citas-doctor/${doctor_id}`)
    .then(res => setCitas(res.data))
    .catch(err => console.error(err));
}, []);

const hoyDate = new Date();
const hoy = `${hoyDate.getFullYear()}-${String(hoyDate.getMonth() + 1).padStart(2, '0')}-${String(hoyDate.getDate()).padStart(2, '0')}`;

const citasHoy = citas.filter(c =>
  c.fecha_inicio?.slice(0, 10) === hoy
);

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const consultasHoy = consultas.filter(c =>
  c.created_at?.slice(0, 10) === hoy
);

const citasPendientes = citasHoy.filter(c => c.estado === "pendiente").length;

const citasCompletadas = citasHoy.filter(c => c.estado === "completada").length;

const totalRecetasHoy = consultasHoy.length;
  
  return (
    <div>
      <Layout_Medicos>

          <div style={{display:"flex", alignItems:"center"}}>
            <h1 className="titulo-dashboard" style={{ marginLeft: '20px' }}>
  Hola {usuario ? `Dr. ${usuario.nombre}` : "Doctor"}
</h1>
            <Button  className="btn-nueva-consulta" style={{ marginLeft: "800px" }}  as={Link}  to="/Medicos/consulta"> + Nueva Consulta</Button>
            
          </div>


          <h5 className="titulo-dashboard" style={{ marginLeft: '20px' }}>
  Bienvenido {usuario?.nombre || "Doctor"}, listo para tu jornada 👨‍⚕️
</h5>

          <div className="dashboard-container">
          
              {/* --- COLUMNA IZQUIERDA (Principal) --- */}
              <div className="main-section">
                
                {/* Fila de Tarjetas */}
  <div className="stats-row">

  {/* CITAS DEL DÍA */}
  <div className="stat-card">
    <div className="stat-header">
      <div className="icon-box blue">
        <CalendarMonthIcon />
      </div>
    </div>
    <p className="stat-title">Citas del día</p>
    <h2 className="stat-number">{citasHoy.length}</h2>
  </div>

  {/* EN ESPERA */}
  <div className="stat-card">
    <div className="stat-header">
      <div className="icon-box orange">
        <AssignmentLateIcon />
      </div>
    </div>
    <p className="stat-title">Pacientes en espera</p>
    <h2 className="stat-number">{citasPendientes}</h2>
  </div>

  {/* COMPLETADAS */}
  <div className="stat-card">
    <div className="stat-header">
      <div className="icon-box green">
        <TaskAltIcon />
      </div>
    </div>
    <p className="stat-title">Completadas</p>
    <h2 className="stat-number">{citasCompletadas}</h2>
  </div>

  {/* RECETAS */}
  <div className="stat-card">
    <div className="stat-header">
      <div className="icon-box purple">
        <MedicationIcon />
      </div>
    </div>
    <p className="stat-title">Recetas del día</p>
    <h2 className="stat-number">{totalRecetasHoy}</h2>
  </div>

</div>

                {/* TABLA DE CITAS */}
                <h1 className="titulo-dashboard" style={{ marginLeft: '20px' }}>Citas del día</h1>

                <div style={{ display: "flex" }}>
<div style={{
  width: '750px',
  marginLeft: '20px',
  backgroundColor: 'white',
  borderRadius: '24px',
  padding: '10px'
}}>

<Table className="agenda-table">
  <thead>
    <tr>
      <th>Hora</th>
      <th>Paciente</th>
      <th>Motivo</th>
      <th>Estado</th>
    </tr>
  </thead>

  <tbody>
    {citasHoy
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((cita, index) => (
        <tr key={index} style={{ borderTop: "1px solid #f1f5f9" }}>

          <td>
            {new Date(cita.fecha_inicio).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </td>

          <td>
            {cita.paciente?.usuario?.nombre} {cita.paciente?.apellidoP}
          </td>

          <td>{cita.motivo}</td>

          <td>
           <Chip
  label={cita.estado}
  color={
    cita.estado === "pendiente"
      ? "warning"
      : cita.estado === "completada"
      ? "success"
      : "default"
  }
/>
          </td>

        </tr>
      ))}
  </tbody>
</Table>

{/* PAGINACIÓN */}
<TablePagination
  component="div"
  count={citasHoy.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>

</div>
              </div>

              </div>

              {/* --- COLUMNA DERECHA (Sidebar) --- */}
              <div className="sidebar-section">
                <h4 className="sidebar-label">ACCESO RÁPIDO</h4>

                  <div className="quick-btns-row">

                      <div className="quick-btn">
                          <Link to="/Medicos/alta_pacientes">
                            <PersonAddAlt1Icon className="quick-btn-icon"/>
                          </Link>
                        <p>Alta Paciente</p>
                      </div>

                      <div className="quick-btn">
                        <HistoryIcon className="quick-btn-icon" />
                        <p>Ver Historial</p>
                      </div>

                  </div>

                <h4 className="sidebar-label" style={{ marginTop: '32px' }}>ÚLTIMAS RECETAS</h4>
                  <div className="prescriptions-list">

{consultasHoy.slice(0, 5).map((consulta, i) => (
  <div key={i} className="prescription-card">
    
    <div className="doc-icon-box">
      <DescriptionIcon fontSize="small" />
    </div>

    <div className="prescription-content">
      <h5>{consulta.motivo}</h5>
      <p>
        {consulta.paciente?.usuario?.nombre} {consulta.paciente?.apellidoP}
      </p>
    </div>

  </div>
))}

                  </div>
              </div>
          </div>
        -
        
        </Layout_Medicos>
    </div>

  );
}

export default Dashboard_medicos;   








