import Layout_Medicos from "./Layout_Medicos";
import { Card, CardContent, Typography } from "@mui/material";
import Button from "react-bootstrap/Button";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

function tratamientos_largos() {

const [editando, setEditando] = useState(null);
const [showModal, setShowModal] = useState(false);




const [showTratamiento, setShowTratamiento] = useState(false);
const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);




const [item, setItem] = useState([
  {nombre:"Erick Sanches", progreso:70, cita:"05/02/2025", tratamiento:"Rehabilitación de rodilla con ejercicios de movilidad y fortalecimiento muscular."},
  {nombre:"Ricardo Rodriguez", progreso:40, cita:"05/02/2025", tratamiento:"Tratamiento de fisioterapia para dolor lumbar con sesiones de estiramiento y electroterapia."},
  {nombre:"Alexito", progreso:90, cita:"05/02/2025", tratamiento:"Recuperación post operatoria con terapia manual y ejercicios de estabilidad."}
]);

const cambiarProgreso = (index, valor) => {
  const nuevoItem = [...item];
  nuevoItem[index].progreso = valor;
  setItem(nuevoItem);
};


const finalizarTratamiento = () => {

  const nuevoItem = [...item];
  nuevoItem[editando].progreso = 100;

  setItem(nuevoItem);
  setShowModal(false);
  setEditando(null);
};

const cancelarTratamiento = () => {

  const nuevoItem = item.filter((_, index) => index !== editando);

  setItem(nuevoItem);
  setShowModal(false);
  setEditando(null);
};

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
              <h2>{item.length}</h2>
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
              <h2>{item.length}</h2>
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
    {item.map((p,i)=>(

    <div className="row align-items-center mb-4" key={i}>

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

                {editando === i ? (

              <input type="range" min="0" max="100" value={p.progreso} onChange={(e)=>cambiarProgreso(i,e.target.value)} style={{width:"100%"}} />

              ) : (

                <div style={{ height:"8px", background:"#e5e7eb", borderRadius:"20px" }}>
                  <div style={{width:`${p.progreso}%`,background:"#6366f1",height:"8px",borderRadius:"20px"}}></div>
                </div>

              )}

              <Typography style={{fontSize:"12px",color:"#6b7280"}}>
              {p.progreso}% completado
              </Typography>

          </div>

        {/* CITA */}
        <div className="col-md-2">
          {p.cita}
        </div>

        {/* EDITAR */}
        <div className="col-md-2">

          <EditIcon style={{cursor:"pointer",color:"#374151"}} onClick={()=>{ setEditando(i); setShowModal(true);}}/>

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

      {editando !== null && (

     <>

          <Typography style={{fontWeight:"600", marginBottom:"10px"}}>
          Paciente: {item[editando].nombre}
          </Typography>

          <Typography style={{fontSize:"14px", marginBottom:"10px"}}>
          Progreso del tratamiento
          </Typography>

        <input type="range"min="0"max="100"value={item[editando].progreso}onChange={(e)=>cambiarProgreso(editando, e.target.value)}style={{width:"100%"}}/>

        <Typography style={{marginTop:"10px", color:"#6b7280"}}>
          {item[editando].progreso}% completado
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

        <Typography style={{color:"#374151"}}>
          {pacienteSeleccionado.tratamiento}
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