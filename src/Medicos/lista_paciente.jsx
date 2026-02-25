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

                <div style={{backgroundColor:"white", width:"95%", height:"120px", borderRadius:"70px", justifyContent: "center", display: "flex", alignItems: "center",boxShadow: "0 0 0 6px #E8E8E8", margin: "0 auto",  flexDirection: "column",}}>
                    <div style={{ position: "relative", marginTop:"18px"}}>
                     <Form style={{ width: "1120px" }}>
                        <Form.Group controlId="formGroupEmail">
                            <Form.Control type="email" placeholder="Nombre del paciente" style={{ paddingRight: "50px", }} />
                            <SearchIcon onClick={buscarPaciente}  style={{ position: "absolute",right: "15px",top: "50%",transform: "translateY(-50%)",color: "gray",  cursor: "pointer" }} />  
                        </Form.Group>
                     </Form>
                     </div>

                     <FilterAltIcon style={{ alignSelf: "flex-end", marginRight: "40px", marginTop:"15px",  fontSize: '25px', color:"blue"}}/>

                        
                     
                </div>
                <br />
                <br />
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
