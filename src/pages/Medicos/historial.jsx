import { useLocation } from "react-router-dom";

function Historial() {

  const location = useLocation();
  const paciente = location.state?.paciente;

  return (
    <div>

      <h2>Historial clínico</h2>

      <h3>
        {paciente.nombre} {paciente.apellidoP}
      </h3>

      <p>ID: {paciente.id}</p>

    </div>
  );
}

export default Historial;