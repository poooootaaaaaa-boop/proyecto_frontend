import { useState } from "react";
import Layout_Medicos from "./Layout_Medicos";
import {  CardContent, Typography,Chip} from "@mui/material";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Mensaje from "./mensaje";

function Consulta({data,setData, dataPacientes}){
    const [pacienteId, setPacienteId] = useState("");
    const[motivo, setMotivo]=useState("");
    const[sintomas, setSintomas]=useState("");
    const[examen, setExamen]=useState("");
    const [mostrarMensaje,setMostrarMensaje]=useState(false);
    const [notas, setNotas] = useState("");

      const guardar = () => {
    // find patient info so we can include name in the stored record
    const selected = dataPacientes.find(p => String(p.id) === String(pacienteId));
    const nuevoPaciente = {
      id: Date.now(),
      pacienteId,
      motivo,
      sintomas,
      examen,
      notas,
      nombre: selected?.nombre || "",
      apellido: selected?.apellidoP || ""
    };
    if (typeof setData === "function") {
      setData(prev => [...prev, nuevoPaciente]);
      setMostrarMensaje(true);  
    } else {
      console.error("setData no es una función", setData);
    }
    setMotivo("");
    setSintomas("");
    setExamen("");
    setNotas("");
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
                                <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>

                                        <Row className="mt-3">
                                            
                                            <br />
                                            <Col md={6}>
                                            <Form.Label className="text-dark fw-bold">Nombre del paciente</Form.Label>
                                            <Form.Select 
                                                    value={pacienteId}
                                                    onChange={(e)=>setPacienteId(e.target.value)}
                                                    >

                                                    <option value="">Seleccionar paciente</option>

                                                    {dataPacientes.map((paciente)=>(
                                                    <option key={paciente.id} value={paciente.id}>
                                                        {paciente.nombre} {paciente.apellidoP}
                                                    </option>
                                                    ))}

                                                    </Form.Select>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Label className="text-dark fw-bold">Motivo de la consulta</Form.Label>

                                                <Form.Control value={motivo} onChange={(e)=>setMotivo(e.target.value)}/>
                                            </Col>

                                        </Row>
                                </div>

                                <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>

                                    <Row>
                                        
                                         <Col md={8}>

                                            <Row>
                                                <Col md={12}> 

                                                    <Form.Label className="text-dark fw-bold"> Sintomas</Form.Label>

                                                    <Form.Control as="textarea"rows={4} value={sintomas} onChange={(e)=>setSintomas(e.target.value)}/>
                                                
                                                </Col>
                                            </Row>


                                            <Row className="mt-3">

                                                 <Col md={12}>

                                                 <Form.Label className="fw-bold" style={{color:"#7c3aed"}}>
                                                    📝 Notas del médico
                                                </Form.Label>

                                             <Form.Control as="textarea"rows={8} placeholder="Escriba aquí observaciones adicionales, recomendaciones o notas importantes..." style={{background:"#faf5ff",border:"1px solid #e9d5ff",resize:"none"}}  value={notas} onChange={(e)=>setNotas(e.target.value)}/>
                                                 
                                                 
                                                 </Col>

                                            </Row>
                                               
                                         
                                        </Col>

                                           {/* LADO DERECHO */}

                                        {/* INPUT DE NOTAS */}
                                         <Col md={4}>
                                            <Form.Label className="text-dark fw-bold"> Examen físico</Form.Label>

                                            <Form.Control value={examen} onChange={(e)=>setExamen(e.target.value)}/> 

                                        </Col>

                                    </Row>



                                </div>


                                <br />

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