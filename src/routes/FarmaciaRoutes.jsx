import { Routes, Route } from "react-router-dom";
import DashboardFarmacia from "../pages/farmacia/DashboardFarmacia";
import HomeFarmacia from "../pages/farmacia/HomeFarmacia";
import Recetas from "../pages/farmacia/Recetas";
import Inventario from "../pages/farmacia/Inventario";
import Medicamentos from "../pages/farmacia/Medicamentos";
import AgregarMedicamento from "../pages/farmacia/AgregarMedicamento";
import Distribuidores from "../pages/farmacia/Distribuidores";
import AgregarDistribuidor from "../pages/farmacia/AgregarDistribuidor";
import Configuracion from "../pages/farmacia/Configuracion";
import Doctors from "../pages/farmacia/Doctors";
import AgregarDoctor from "../pages/farmacia/AgregarDoctor";
import Stock from "../pages/Medicos/prueba";
import AgregarConsultorios from "../pages/farmacia/AgregarConsultorio";
import ConfigurarPagoDoctor from "../pages/farmacia/ConfigurarPagoDoctor";
import AsignarDoctorConsultorio from "../pages/farmacia/AsignarDoctorConsultorio";
import ManifestoResiduo from "../pages/farmacia/ManifestoResiduo";
import MedicinasCaducacadas from "../pages/farmacia/MedicinasCaducacadas";



export default function FarmaciaRoutes(){
    return(
        <Routes>
            <Route path="dashboard" element={<DashboardFarmacia />}/>
            <Route path="prueba" element={<Stock />} />
            <Route path="manifesto-residuo" element={<ManifestoResiduo />} /> /* nuevo*/
            <Route path="medicinas-caducadas" element={<MedicinasCaducacadas />} /> /* nuevo*/

            <Route path="Home" element={<HomeFarmacia />}/>
            <Route path="RecetasMedicas" element={<Recetas />}/>
            <Route path="inventario" element={<Inventario />}/>
            <Route path="medicamentos" element={<Medicamentos />}/>
            <Route path="AgregarMedicamento" element={<AgregarMedicamento/>}/>
            <Route path="Distribuidores" element={<Distribuidores/>}/>
            <Route path="AgregarDistribuidor" element={<AgregarDistribuidor/>}/>
            <Route path="configuracion" element={<Configuracion/>}/>
            <Route path="doctores" element={<Doctors/>}/>
            <Route path="agregardoctor" element={<AgregarDoctor/>}/>
            <Route path="agregar-consultorios" element={<AgregarConsultorios/>}/>
            <Route path="configurar-pago-doctor" element={<ConfigurarPagoDoctor/>}/>
            <Route path="asignar-doctor-consultorio" element={<AsignarDoctorConsultorio/>}/>
        </Routes>
    );
}