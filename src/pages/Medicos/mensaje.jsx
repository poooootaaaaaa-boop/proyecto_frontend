import { Card, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Mensaje({
  titulo,
  descripcion,
  botonPrincipal,
  botonSecundario,
  onPrincipal,
  onSecundario,
  icono
}) {
  return (

    <div style={{
      background:"#f5f5f5",
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    }}>

      <Card style={{
        padding:"40px",
        borderRadius:"20px",
        textAlign:"center",
        width:"400px"
      }}>

        {/* Icono */}
        <div style={{marginBottom:"20px"}}>
          {icono ? icono : <CheckCircleIcon style={{fontSize:"60px", color:"green"}} />}
        </div>

        {/* Titulo */}
        <Typography variant="h5" style={{fontWeight:"600"}}>
          {titulo}
        </Typography>

        {/* Descripción */}
        <Typography style={{marginTop:"10px", color:"gray"}}>
          {descripcion}
        </Typography>

        {/* Botón principal */}
        <Button
          variant="contained"
          fullWidth
          onClick={onPrincipal}
          style={{marginTop:"20px", borderRadius:"20px"}}
        >
          {botonPrincipal}
        </Button>

        {/* Botón secundario */}
        {botonSecundario && (
          <Button
            variant="outlined"
            fullWidth
            onClick={onSecundario}
            style={{marginTop:"10px", borderRadius:"20px"}}
          >
            {botonSecundario}
          </Button>
        )}

      </Card>

    </div>

  );
}

export default Mensaje;