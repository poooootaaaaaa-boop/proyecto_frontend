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
import MedicationIcon from '@mui/icons-material/Medication';

function Dashboard_medicos({citas, consultas=[]}) {
  
  return (
    <div>
      <Layout_Medicos>

          <div style={{display:"flex", alignItems:"center"}}>
            <h1 className="titulo-dashboard" style={{ marginLeft: '20px' }}>Hola Dr. García</h1>
            <Button  className="btn-nueva-consulta" style={{ marginLeft: "800px" }}  as={Link}  to="/Medicos/consulta"> + Nueva Consulta</Button>
            
          </div>


          <h5 className="titulo-dashboard" style={{ marginLeft: '20px' }}>Bienvenido aqui estamos de nuevo Angelito</h5>

          <div className="dashboard-container">
          
              {/* --- COLUMNA IZQUIERDA (Principal) --- */}
              <div className="main-section">
                
                {/* Fila de Tarjetas */}
                  <div className="stats-row">

                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="icon-box blue">
                          <CalendarMonthIcon />
                        </div>
                      </div>
                      <p className="stat-title">Citas del día</p>
                      <h2 className="stat-number">18</h2>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="icon-box orange">
                          <AssignmentLateIcon />
                        </div>
                      </div>
                      <p className="stat-title">Pacientes en espera</p>
                      <h2 className="stat-number">5</h2>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="icon-box green">
                          <TaskAltIcon />
                        </div>
                      </div>
                      <p className="stat-title">Consultas completadas</p>
                      <h2 className="stat-number">12</h2>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <div className="icon-box purple">
                          <MedicationIcon />
                        </div>
                      </div>
                      <p className="stat-title">Recetas del día</p>
                      <h2 className="stat-number">2</h2>
                    </div>

                  </div>

                {/* TABLA DE CITAS */}
                <h1 className="titulo-dashboard" style={{ marginLeft: '20px' }}>Citas del día</h1>

                <div style={{ display: "flex" }}>
                    <div style={{ width: '750px', marginLeft: '20px',backgroundColor: 'white', borderRadius: '24px', padding: '5px',marginTop: '0px'}}>
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
                            {citas.map((item,index)=> ( 
                              
                              <tr key={index} style={{borderTop:"1px solid #f1f5f9"}}>

                                <td>{item.fechaCita}</td>

                                <td>{item.nombre} {item.apellidoP}</td>


                                <td>{item.motivoCita}</td>

                                <td><span className="estado-badge espera">En espera</span></td>

                              </tr>  
                              
                              
                              ))}
                          </tbody>
                      </Table>
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

                    {consultas.map((pacientes, i) => (
                      <div key={i} className="prescription-card">
                        <div className="doc-icon-box"><DescriptionIcon fontSize="small" /></div>
                        <div className="prescription-content">
                          <h5>{pacientes.motivo}</h5>
                          <p>{pacientes.nombre} {pacientes.apellido}</p>
                        </div>
                      </div>
                    ))}

                  </div>
              </div>
          </div>
        
        
        </Layout_Medicos>
    </div>

  );
}

export default Dashboard_medicos;   








