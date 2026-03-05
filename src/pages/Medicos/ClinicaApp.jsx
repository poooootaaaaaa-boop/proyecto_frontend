import { useState } from "react";
import Consulta from "./consulta"; 
import Recetas_medicas from "./recetas_medicas";
import Alta_pacientes from "./alta_pacientes";
import Lista_paciente from "./lista_paciente";
import Citas from "./citas";
import Agenda from "./agenda";
import Dashboard_medicos from "./Dashboard_medicos";
function ClinicaApp() {
  const [data, setData] = useState([]); 
   const [dataPacientes, setDataPacientes] = useState([]);
   const [dataCitas, setDataCitas] = useState([]);

  return (
    <>
      <Consulta data={data} setData={setData} dataPacientes={dataPacientes}/> {/* solo agregue esto dataPacientes={dataPacientes} */}
      <Recetas_medicas data={data} /> 


      <Alta_pacientes data={dataPacientes} setData={setDataPacientes} />
      <Lista_paciente data={dataPacientes}/>

      <Citas data={dataCitas} setData={setDataCitas} />
      <Agenda data={dataCitas} />

      <Dashboard_medicos 
        citas={dataCitas} 
        consultas={data}>

      </Dashboard_medicos>

    </>
  );
}

export default ClinicaApp;