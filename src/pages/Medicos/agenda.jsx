import Layout_Medicos from "./Layout_Medicos";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Button from 'react-bootstrap/Button';
import AddIcon from '@mui/icons-material/Add';
import "./Tablas.css";
import { Link } from "react-router-dom";
import Calendar from "./Calendar";
import dayjs from "dayjs";
import "dayjs/locale/es";
function agenda({data=[]}){ 



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


                    
                        {/* CALENDARIO */}
                        <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "20px",
                            border: "1px solid #e5e7eb"
                        }}
                        >

                        <Calendar citas={data} />

                        </div>

                </div>

            </Layout_Medicos>
        </div>
    );
}export default agenda;