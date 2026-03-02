import Layout_Medicos from "./Layout_Medicos";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Button from 'react-bootstrap/Button';
import AddIcon from '@mui/icons-material/Add';
import "./Tablas.css";
import { Link } from "react-router-dom";
function agenda({data=[]}){ 
    const eventos = data.map(cita => ({

        title: cita.nombre + " " + cita.apellidoP,

        start: cita.fechaCita,
        color: "green" 

        }));
    return(
        <div>
            <Layout_Medicos>

                <div className="container-fluid">

                        
                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <div>
                            <h3 className="fw-bold">Agenda Médica</h3>
                            <small className="text-muted">
                                Administración de citas
                            </small>
                        </div>

                        <Button variant="primary" as={Link} to="/Medicos/citas"><AddIcon /> Nueva Cita</Button>

                    </div>


                    
                    {/* Calendario */}
                    <div className="bg-light p-3 rounded shadow-sm">

                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            events={eventos}
                            height={600}
                        />

                    </div>

                </div>

            </Layout_Medicos>
        </div>
    );
}export default agenda;