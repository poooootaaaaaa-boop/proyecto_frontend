import { Link } from "react-router-dom";
import Layout_Medicos from "./Layout_Medicos";
import { colors } from "@mui/material";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function Dashboard_medicos() {
  return (
    <div>
      <Layout_Medicos>

          <div style={{display:"flex"}}>
            <h1>Hola Dr.Garcia</h1>
            <Button variant="primary" style={{ marginLeft: "700px"}}>Nueva Consulta</Button>
          </div>


          <h5>Bienvenido aqui estamos de nuevo</h5>
          <br />


          <div style={{ display: "flex"}}>
              <Card style={{ width: '18rem', borderRadius: '15px'}}>
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted" >Citas de Hoy</Card.Subtitle>
                  <Card.Title style={{ fontSize: '3rem', fontWeight: 'bold' }}>18</Card.Title>
                </Card.Body>
              </Card>
              
              <Card style={{ width: '18rem', borderRadius: '15px'}}>
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">Citas de Hoy</Card.Subtitle>
                  <Card.Title style={{ fontSize: '3rem', fontWeight: 'bold' }}>18</Card.Title>
                </Card.Body>
              </Card>

              <Card style={{ width: '18rem', borderRadius: '15px'}}>
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">Citas de Hoy</Card.Subtitle>
                  <Card.Title style={{ fontSize: '3rem', fontWeight: 'bold' }}>18</Card.Title>
                </Card.Body>
              </Card>
          </div>

          <br />

          <h2>Pacientes en espera</h2>

          <div style={{display:"flex"}}>
              <div>
                hola
              </div>



              <div style={{ marginLeft: '870px', backgroundColor: '#F0F2F5',  borderRadius: '10px', padding: '10px', width: '300px', height: '170px', textAlign: 'center',  alignItems: 'center'}}>
                <h4>Acceso Rapidos</h4>
                <br />
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                  <div  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <PersonAddAlt1Icon style={{ fontSize: '40px', color: 'blue' }} />
                    <h5>Alta paciente</h5>
                  </div>

                  <div  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <AccessTimeIcon style={{ fontSize: '40px', color: 'blue' }} />
                    <h5>Ver historial</h5>
                  </div>

                </div>



        

              </div>



          </div>
          <br />





          <h2>Citas del dia</h2>
          <br />

          <div style={{display:"flex"}}>
            <div style={{ width: '650px', marginLeft: '130px', marginTop: '10px'}}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>14:30</td>
                    <td>Angelito</td>
                    <td>Consulta Medica</td>
                    <td>En espera</td>
                  </tr>

                  <tr>
                    <td>14:30</td>
                    <td>Erick</td>
                    <td>Consulta Medica</td>
                    <td>En espera</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            <div style={{ marginLeft: '200px' }}>
              <h4>Ultimas Recetas</h4>
              
            </div>
            

          </div>




        
      </Layout_Medicos>
    </div>

  );
}

export default Dashboard_medicos;   








