import { Typography} from "@mui/material";
import Layout_Medicos from "./Layout_Medicos";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

function Alta_pacientes({ data, setData }){

        const[nombre, setNombre]=useState("");
        const[apellidoP, setApellidoP]=useState("");
         const[apellidoM, setApellidoM]=useState("");
        const[nacimiento, setNacimiento]=useState("");
        const[genero, setGenero]=useState("");
        const[telefono, setTelefono]=useState("");
        const[correo, setCorreo]=useState("");
        const[direccion, setDireccion]=useState("");
        const[colonia, setColonia]=useState("");
        const[ciudad, setCiudad]=useState("");
        const[estado, setEstado]=useState("");
        const[codigoPostal, setCodigoPostal]=useState("");
        const[tipoSangre, setTipoSangre]=useState("");
        const[alergias, setAlergias]=useState("");
        const[padecimientoHeredofamiliar, setPadecimientoHeredofamiliar]=useState("");
        

        const finalizar = () => {
            const altaPaciente = { nombre,apellidoP, apellidoM, nacimiento, genero,telefono,correo,colonia,ciudad,estado,codigoPostal,tipoSangre,alergias,padecimientoHeredofamiliar};
            if (typeof setData === "function") {
            setData(prev => [...prev, altaPaciente]); 
            } else {
            console.error("setData no es una función", setData);
            }

            setNombre("");
            setApellidoP("");
            setApellidoM("");
            setNacimiento("");
            setGenero("");
            setTelefono("");
            setCorreo("");
            setDireccion("");
            setColonia("");
            setCiudad("");
            setEstado("");
            setCodigoPostal("");
            setTipoSangre("");
            setAlergias("");
            setPadecimientoHeredofamiliar("");
        };


    return(
    <div>
        <Layout_Medicos>
            <div className="container mt-4">
                <h1 style={{fontWeight:"600"}}>Alta de pacientes</h1>
                <Typography style={{fontSize: "17px",color: "gray"}}>Complete la informacion para crear el expediente del paciente</Typography>

                <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>

                    <h5 style={{fontWeight:"600"}}><PersonIcon style={{fontSize:"25px",marginRight:"5px",color:"blue"}}/>Información Personal</h5>

                    <Row className="mt-3">
                        <Col md={4}>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control value={nombre} onChange={(e) => setNombre(e.target.value)} type="text"placeholder="Ingresa tu nombre" />
                        </Col>

                        <Col md={4}>
                            <Form.Label>Apellido Paterno</Form.Label>
                            <Form.Control value={apellidoP} onChange={(e) => setApellidoP(e.target.value)} type="text" placeholder="ingresa tu apellido paterno" />
                        </Col>

                        <Col md={4}>
                            <Form.Label>Apellido Materno</Form.Label>
                            <Form.Control value={apellidoM} onChange={(e) => setApellidoM(e.target.value)} type="text" placeholder="ingresa tu apellido materno"/>
                        </Col>

                    </Row>

                    <Row className="mt-3">

                        <Col md={6}>
                            <Form.Label>Fecha de nacimiento</Form.Label>
                            <Form.Control value={nacimiento} onChange={(e) => setNacimiento(e.target.value)} type="date" placeholder="ingresa tu fecha de nacmiento"/>
                        </Col>

                        <Col md={6}>
                            <Form.Label>Genero</Form.Label>
                            <Form.Control value={genero} onChange={(e) => setGenero(e.target.value)} type="text"/>
                        </Col>

                    </Row>

                </div>
            
                <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>

                    <h5 style={{fontWeight:"600"}}><ContactPhoneIcon style={{fontSize:"25px",marginRight:"5px",color:"blue"}}/>Información de Contacto</h5>


                    <Row className="mt-3">

                        <Col md={6}>
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control value={telefono} onChange={(e) => setTelefono(e.target.value)} type="number" placeholder="Ingresa tu numero de telefono"/>
                        </Col>

                        <Col md={6}>
                            <Form.Label>Correo</Form.Label>
                            <Form.Control value={correo} onChange={(e) => setCorreo(e.target.value)} type="email" placeholder="Ingresa tu correo electronico"/>
                        </Col>

                    </Row>


                    <Row className="mt-3">

                        <Col md={12}>
                            <Form.Label>Direccion</Form.Label>
                            <Form.Control value={direccion} onChange={(e) => setDireccion(e.target.value)} type="text" placeholder="Ingresa tu direccion"/>

                            <Form.Label>Colonia</Form.Label>
                            <Form.Control value={colonia} onChange={(e) => setColonia(e.target.value)} type="text"placeholder="Ingresa tu colonia" />
                        </Col>

                    </Row>


                    <Row className="mt-3">

                        <Col md={4}>
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control value={ciudad} onChange={(e) => setCiudad(e.target.value)} type="text" placeholder="Ingresa tu ciudad"/>
                        </Col>

                        <Col md={4}>
                            <Form.Label>Estado</Form.Label>
                            <Form.Control value={estado} onChange={(e) => setEstado(e.target.value)} type="text" placeholder="Ingresa tu estado"/>
                        </Col>

                        <Col md={4}>
                            <Form.Label>Codigo Postal</Form.Label>
                            <Form.Control value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} type="number" placeholder="Ingresa tu codigo postal"/>
                        </Col>

                    </Row>

                </div>



            
                <div className="bg-white p-4 mb-4" style={{ borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>

                    <h5 style={{fontWeight:"600"}}><MedicalInformationIcon style={{fontSize:"25px",marginRight:"5px",color:"blue"}}/>Historial Médico</h5>

                    <Row className="mt-3">

                        <Col md={6}>
                            <Form.Label>Tipo de sangre</Form.Label>
                            <Form.Control value={tipoSangre} onChange={(e) => setTipoSangre(e.target.value)} type="text" placeholder="Ingresa tu tipo de sangre"/>
                        </Col>

                        <Col md={6}>
                            <Form.Label>Alergias</Form.Label>
                            <Form.Control as="textarea" rows={3} value={alergias} onChange={(e) => setAlergias(e.target.value)} type="text"placeholder="Ingresa unicamente si tienes alguna alergia"/>
                        </Col>

                        <Col md={6}>
                            <Form.Label>Padecimiento Herdofamiliares</Form.Label>
                            <Form.Control value={padecimientoHeredofamiliar} onChange={(e) => setPadecimientoHeredofamiliar(e.target.value)} type="text" placeholder="Especifique"/>
                        </Col>

                    </Row>

                </div>


                <div className="text-end mb-5">

                    <Button variant="danger" style={{marginRight:"10px"}}> Cancelar</Button>

                    <Button onClick={finalizar}> Finalizar Registro </Button>

                </div>


            </div>
        </Layout_Medicos>
    </div>
    )
}export default Alta_pacientes