import Layout_Medicos from "./Layout_Medicos";
import { Card, CardContent, Typography } from "@mui/material";
import Button from "react-bootstrap/Button";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

function tratamientos_largos({ data, setData }) {

const [tratamientoEditando, setTratamientoEditando] = useState(null);
const [showModal, setShowModal] = useState(false);




const [showTratamiento, setShowTratamiento] = useState(false);
const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);



const cambiarProgreso = (id, valor) => {

  const nuevos = data.map((t) =>
    t.id === id ? { ...t, progreso: valor } : t
  );

  setData(nuevos);

  // actualizar el objeto del modal con el nuevo valor
  const actualizado = nuevos.find((t) => t.id === id);
  setTratamientoEditando(actualizado);
};


const finalizarTratamiento = () => {

  const nuevos = data.map((t) =>
    t.id === tratamientoEditando.id
      ? { ...t, progreso: 100 }
      : t
  );

  setData(nuevos);
  setShowModal(false);
  setTratamientoEditando(null);

};

const cancelarTratamiento = () => {

  const nuevos = data.filter(
    (t) => t.id !== tratamientoEditando.id
  );

  setData(nuevos);
  setShowModal(false);
  setTratamientoEditando(null);

};

const tratamientos = data.filter(
  (item) => item.tratamientoLargo === "si"
);

return (
<Layout_Medicos>

  <div className="container mt-4">

      {/* TITULO */}
      <h2 style={{fontWeight:"700"}}>Seguimiento de tratamientos largos</h2>
      <Typography style={{color:"#6b7280"}}>
      Monitoreo clínico de progreso y alertas
      </Typography>

    <br/>

    {/* TARJETAS */}
    <div className="row g-3">

        <div className="col-md-4">
          <Card style={{borderRadius:"18px"}}>
          <CardContent style={{display:"flex",justifyContent:"space-between"}}>
            <div>
              <Typography style={{color:"#6b7280"}}>Tratamientos activos</Typography>
              <h2>{tratamientos.length}</h2>
            </div>
            <AssignmentIcon style={{fontSize:"40px",color:"#2563eb"}}/>
          </CardContent>
          </Card>
       </div>

        <div className="col-md-4">
          <Card style={{borderRadius:"18px"}}>
          <CardContent style={{display:"flex",justifyContent:"space-between"}}>
           <div>
              <Typography style={{color:"#6b7280"}}>Próximas citas</Typography>
              <h2>{tratamientos.length}</h2>
           </div>
            <EventIcon style={{fontSize:"40px",color:"#f59e0b"}}/>
          </CardContent>
          </Card>
        </div>

        <div className="col-md-4">
          <Card style={{borderRadius:"18px"}}>
            <CardContent style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <Typography style={{color:"#6b7280"}}>Pendientes</Typography>
                  <h2>2</h2>
              </div>
            <WarningIcon style={{fontSize:"40px",color:"#ef4444"}}/>
          </CardContent>
        </Card>
      </div>

    </div>

    <br/>

    {/* CONTENEDOR TABLA */}
    <div style={{
    background:"#f8fafc",
    padding:"25px",
    borderRadius:"20px",
    border:"1px solid #e5e7eb"
    }}>

    <div style={{display:"flex",justifyContent:"space-between"}}>
    <div>
    <h5 style={{fontWeight:"700"}}>Monitoreo de tratamientos</h5>
    <Typography style={{color:"#6b7280",fontSize:"14px"}}>
    Seguimiento en tiempo real de progreso
    </Typography>
    </div>
    </div>

    <br/>

    {/* CABECERA */}
    <div className="row mb-3" style={{fontWeight:"600",color:"#6b7280"}}>
    <div className="col-md-4">Paciente</div>
    <div className="col-md-4">Tratamiento</div>
    <div className="col-md-2">Próxima cita</div>
    <div className="col-md-2">Acciones</div>
    </div>

    {/* PACIENTES */}
    {tratamientos.map((p)=>(

    <div className="row align-items-center mb-4" key={p.id}>

    {/* NOMBRE */}
    <div className="col-md-4">
      <div style={{display:"flex",alignItems:"center"}}>
        <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", marginRight:"10px", fontWeight:"600", color:"#1d4ed8"}}>
          {p.nombre.charAt(0)}
        </div>

        <span
          style={{cursor:"pointer",fontWeight:"600",color:"#000000"}}
          onClick={()=>{
            setPacienteSeleccionado(p);
            setShowTratamiento(true);
          }}
        >
          {p.nombre}
        </span>
      </div>
    </div>

        {/* PROGRESO */}
          <div className="col-md-4">


              <input type="range" min="0" max="100" value={p.progreso} onChange={(e)=>cambiarProgreso(p.id, Number(e.target.value))} style={{width:"100%"}} />

              

                <div style={{ height:"8px", background:"#e5e7eb", borderRadius:"20px" }}>
                  <div style={{width:`${p.progreso}%`,background:"#6366f1",height:"8px",borderRadius:"20px"}}></div>
                </div>

             

              <Typography style={{fontSize:"12px",color:"#6b7280"}}>
              {p.progreso}% completado
              </Typography>

          </div>

        {/* CITA */}
        <div className="col-md-2">
           {p.fechaTratamiento}
        </div>

        {/* EDITAR */}
        <div className="col-md-2">

          <EditIcon style={{cursor:"pointer",color:"#374151"}} onClick={()=>{ setTratamientoEditando(p); setShowModal(true);}}/>

        </div>

     </div>

    ))}

  </div>

</div>


  <Modal show={showModal} onHide={()=>setShowModal(false)} centered>

      <Modal.Header closeButton>
        <Modal.Title>Editar Tratamiento</Modal.Title>
      </Modal.Header>

                <Modal.Body>

          {tratamientoEditando && (

          <>
          <Typography style={{fontWeight:"600", marginBottom:"10px"}}>
          Paciente: {tratamientoEditando.nombre}
          </Typography>

          <Typography style={{fontSize:"14px", marginBottom:"10px"}}>
          Progreso del tratamiento
          </Typography>

          <input
          type="range"
          min="0"
          max="100"
          value={tratamientoEditando.progreso}
          onChange={(e)=>cambiarProgreso(tratamientoEditando.id, Number(e.target.value))}
          style={{width:"100%"}}
          />

          <Typography style={{marginTop:"10px", color:"#6b7280"}}>
          {tratamientoEditando.progreso}% completado
          </Typography>

          </>

          )}

          </Modal.Body>

    <Modal.Footer>

      <Button onClick={finalizarTratamiento}variant="success" style={{background:"#16a34a",border:"none",borderRadius:"30px",padding:"12px 25px",fontWeight:"600"}}>
        Finalizar tratamiento
      </Button>

      <Button variant="danger" onClick={cancelarTratamiento}style={{background:"#dc2626",border:"none",borderRadius:"30px",padding:"12px 25px",fontWeight:"600"}}>
        Cancelar tratamiento
      </Button>

      <Button variant="secondary"onClick={()=>setShowModal(false)} style={{background:"#6b7280",border:"none",borderRadius:"30px",padding:"12px 25px",fontWeight:"600", color:"#fff"}}>
      Cerrar
      </Button>

    </Modal.Footer>

  </Modal>






  <Modal show={showTratamiento} onHide={()=>setShowTratamiento(false)} centered>

  <Modal.Header closeButton>
    <Modal.Title>Tratamiento del paciente</Modal.Title>
  </Modal.Header>

  <Modal.Body>

    {pacienteSeleccionado && (
      <>
        <Typography style={{fontWeight:"600",marginBottom:"10px"}}>
          Paciente: {pacienteSeleccionado.nombre}
        </Typography>

        <Typography style={{fontWeight:"600"}}>
          Motivo del tratamiento:
        </Typography>
        <Typography style={{marginBottom:"10px",color:"#374151"}}>
          {pacienteSeleccionado.motivo}
        </Typography>
      </>
    )}

  </Modal.Body>

  <Modal.Footer>

    <Button
      onClick={()=>setShowTratamiento(false)}
      style={{
        background:"#6b7280",
        border:"none",
        borderRadius:"30px",
        padding:"10px 20px",
        fontWeight:"600"
      }}
    >
      Cerrar
    </Button>

  </Modal.Footer>

</Modal>


</Layout_Medicos>
);
}

export default tratamientos_largos;