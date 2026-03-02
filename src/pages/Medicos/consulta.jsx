import { useState } from "react";
import Layout_Medicos from "./Layout_Medicos";
import {  CardContent, Typography,Chip} from "@mui/material";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Mensaje from "./mensaje";

function Consulta({data,setData}){
    const[nombre, setNombre]=useState("");
    const[apellido, setApellido]=useState("");
    const[motivo, setMotivo]=useState("");
    const[sintomas, setSintomas]=useState("");
    const[examen, setExamen]=useState("");
    const [mostrarMensaje,setMostrarMensaje]=useState(false);

      const guardar = () => {
    const nuevoPaciente = { nombre, apellido, motivo, sintomas, examen };
    if (typeof setData === "function") {
      setData(prev => [...prev, nuevoPaciente]);
      setMostrarMensaje(true);  
    } else {
      console.error("setData no es una función", setData);
    }

    setNombre("");
    setApellido("");
    setMotivo("");
    setSintomas("");
    setExamen("");
  };


    return(
        <div>
            <Layout_Medicos>

                {mostrarMensaje ? (
                
                    <Mensaje
                        titulo="¡Consulta Registrada!"
                        descripcion="La consulta fue agregada correctamente."
                        botonPrincipal="Volver"
                        onPrincipal={()=>setMostrarMensaje(false)}
                    />
                
                            ) : (  

                        <div>
                             <div className="container mt-4" >
                                 <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}>Formulario Clinico</h3>
                                 <Typography style={{fontSize: "17px",color: "gray"}}>Registra el Proceso de la Consulta Actual</Typography>
                                <div className="bg-white p-4 mb-4" style={{borderRadius:"10px", border: "1px solid #f1f5f9",boxShadow:"none"}}>

                                    <Row className="mt-3">
                                        
                                        <br />
                                        <Col md={6}>
                                        <Form.Label className="text-primary fw-bold">Nombre del paciente</Form.Label>

                                        <Form.Control value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                        </Col>


                                        <br />

                                        <Col md={6}> 

                                        <Form.Label className="text-primary fw-bold">Apellido del paciente</Form.Label>

                                        <Form.Control value={apellido} onChange={(e)=>setApellido(e.target.value)}/>
                                        </Col>
                                    </Row>


                                        <br />

                                        <Col md={4}>

                                            <Form.Label className="text-primary fw-bold">Motivo de la consulta</Form.Label>

                                            <Form.Control value={motivo} onChange={(e)=>setMotivo(e.target.value)}/>
                                        </Col>

                                        <br/>

                                        <Form.Label className="text-primary fw-bold"> Sintomas</Form.Label>

                                        <Form.Control as="textarea"rows={4} value={sintomas} onChange={(e)=>setSintomas(e.target.value)}/>

                                        <br/>

                                        <Form.Label className="text-primary fw-bold"> Examen físico</Form.Label>

                                        <Form.Control value={examen} onChange={(e)=>setExamen(e.target.value)}/>


                                        <br /><br /><br /><br />

                                </div>




                            </div>


                            <Container>
                                <Row>
            

                                    <div className="text-end">
                                        <Button variant="danger" style={{width:"25%", marginRight: "10px" }}>Cancelar consulta</Button>

                                        <Button onClick={guardar} style={{width:"25%"}}> Finalizar Consulta</Button>
                                    
                                    </div>

                                </Row>

                            </Container>



                        </div>
                            )}
            </Layout_Medicos>

        </div>

    )
}
export default Consulta