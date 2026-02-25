import Layout_Medicos from "./Layout_Medicos"
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import SearchIcon from '@mui/icons-material/Search';
import Button from 'react-bootstrap/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import "./Tablas.css";




function lista_paciente() { 
      const buscarPaciente = () => {
    console.log("Buscando paciente")
  }
    return (
        <div>
            <Layout_Medicos>
                <br />
                <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}>Lista de pacientes</h1>
                <br />
                <br />

                <div className="container mt-3">

                    <div className="bg-white p-4" style={{ borderRadius: "20px",border: "1px solid #ddd",boxShadow: "0 2px 6px rgba(0,0,0,0.05)"}}>

                        {/* Buscador centrado */}
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-10 col-lg-8 position-relative">

                                <Form>
                                    <Form.Group>

                                        <Form.Control type="text" placeholder="Nombre del paciente" style={{ paddingRight: "50px" }}/>
                                        <SearchIcon onClick={buscarPaciente} style={{ position: "absolute",right: "20px",top: "50%",transform: "translateY(-50%)",color: "gray",cursor: "pointer"}}/>

                                    </Form.Group>
                                </Form>

                            </div>
                        </div>


                    </div>

                </div>
                <br />
                <br />


                <div style={{ width: '850px', marginTop: '10px',margin:"0 auto" }}>
                    <Table  className="agenda-table">
                        <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Ultima cita</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Angelito Cachondo</td>
                            <td>25/02/2026</td>
                            <td><Button variant="outline-primary">Acceso rapido al expediente</Button></td>
                        </tr>

                        <tr>
                            <td>Angelito Cachondo</td>
                            <td>25/02/2026</td>
                            <td><Button variant="outline-primary">Acceso rapido al expediente</Button></td>
                        </tr>

                        <tr>
                            <td>Angelito Cachondo</td>
                            <td>25/02/2026</td>
                            <td><Button variant="outline-primary">Acceso rapido al expediente</Button></td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
                
            </Layout_Medicos>

            
        </div>
    )
}

export default lista_paciente;
