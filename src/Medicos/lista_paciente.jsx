import Layout_Medicos from "./Layout_Medicos"
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import SearchIcon from '@mui/icons-material/Search';




function lista_paciente() { 
      const buscarPaciente = () => {
    console.log("Buscando paciente")
  }
    return (
        <div>
            <Layout_Medicos>
                <br />
                <h1>Lista de pacientes</h1>
                <br />
                <br />

                <div style={{backgroundColor:"white", width:"95%", height:"100px", borderRadius:"50px", justifyContent: "center", display: "flex", alignItems: "center",boxShadow: "0 0 0 6px #E8E8E8", margin: "0 auto"}}>
                    <div style={{ position: "relative"}}>
                     <Form style={{ width: "1150px" }}>
                        <Form.Group controlId="formGroupEmail">
                            <Form.Control type="email" placeholder="Nombre del paciente" style={{ paddingRight: "50px", }} />
                            <SearchIcon onClick={buscarPaciente}  style={{ position: "absolute",right: "15px",top: "50%",transform: "translateY(-50%)",color: "gray",  cursor: "pointer" }} />
                            
                        </Form.Group>
                     </Form>
                     </div>
                        
                     
                </div>
                <br />
                <br />
                <br />
                <br />


                 <Table style={{borderRadius: "15px", overflow: "hidden", border: "none", width:"1150px", margin: "0 auto" }}>
                    <thead>
                    <tr>
                        <th style={{ backgroundColor: "#F5F5F5",border: "none",padding: "15px",color: "#555"}}>Hora</th>
                        <th style={{backgroundColor: "#F5F5F5",border: "none",color: "#555"}}>Paciente</th>
                        <th style={{backgroundColor: "#F5F5F5",border: "none",color: "#555"}}>Ultima cita</th>
                        <th style={{backgroundColor: "#F5F5F5",border: "none",color: "#555"}}>Acciones</th>

                    </tr>
                    </thead>

                    <tbody style={{ backgroundColor: "white" }}>

                        <tr>
                        <td style={{ border: "none", padding: "15px" }}>14:30</td>
                        <td style={{ border: "none" }}>Angelito</td>
                        <td style={{ border: "none" }}>Consulta Médica</td>
                        <td style={{ border: "none" }}>En espera</td>
                        </tr>

                        <tr>
                        <td style={{ border: "none", padding: "15px" }}>14:30</td>
                        <td style={{ border: "none" }}>Erick</td>
                        <td style={{ border: "none" }}>Consulta Médica</td>
                        <td style={{ border: "none" }}>En espera</td>
                        </tr>

                    </tbody>

                </Table>
                
            </Layout_Medicos>

            
        </div>
    )
}

export default lista_paciente;
