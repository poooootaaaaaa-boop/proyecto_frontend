import Layout_Medicos from "./Layout_Medicos"
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import SearchIcon from '@mui/icons-material/Search';
import Button from 'react-bootstrap/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Typography} from "@mui/material";
import "./Tablas.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Datagrid from "./Datagrid";




function lista_paciente({data=[]}) { 
      const buscarPaciente = () => {
    console.log("Buscando paciente")
  }
    return (
        <div>
            <Layout_Medicos>
                <br />
                <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}>Lista de pacientes</h1>
                <Typography className="medicine-name" style={{color:"gray"}}>Consulte y descargue las recetas médicas de sus pacientes.</Typography>
                <br />
                <br />

                <div className="container mt-3">

                    <div className="bg-white p-4" style={{ borderRadius: "20px",border: "1px solid #ddd",boxShadow: "0 2px 6px rgba(0,0,0,0.05)"}}>

                        {/* Buscador centrado */}
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-10 col-lg-8 ">

                                <div style={{ position:"relative" }}>

                                    <Form>
                                        <Form.Group>

                                            <Form.Control type="text" placeholder="Nombre del paciente" style={{ paddingRight: "50px" }}/>
                                            <SearchIcon onClick={buscarPaciente} style={{ position: "absolute",right: "20px",top: "50%",transform: "translateY(-50%)",color: "gray",cursor: "pointer"}}/>

                                        </Form.Group>
                                    </Form>
                                </div>
                                <br />
                                 <div style={{ marginTop: "10px", display:"flex", alignItems:"center"}}>
                                    <CalendarMonthIcon style={{color: "black", cursor: "pointer",fontSize: "25px"}}/>
                                    <Typography className="medicine-name" style={{color:"black"}}>Ultima Visita</Typography>
                                 </div>

                            </div>
                            
                        </div>

                    </div>

                </div>
                <br />
                <br />
                
                <div style={{ width: '1200px', marginTop: '10px',margin:"0 auto" }}>
                    <Table  className="agenda-table">
                        <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Ultima cita</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                            <tbody>

                                {data.map((paciente,index)=> (

                                    <tr key={index}>

                                        <td>{paciente.nombre} {paciente.apellidoP}</td>

                                        <td>no tiene cita</td>

                                        <td><Button variant="outline-primary">Acceder</Button></td>

                                    </tr>

                                ))}

                            </tbody>
                    </Table>
                </div>
                
            </Layout_Medicos>

            
        </div>
    )
}

export default lista_paciente;
