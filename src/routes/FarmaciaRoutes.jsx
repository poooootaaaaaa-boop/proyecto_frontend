import { Routes, Route } from "react-router-dom";
import DashboardFarmacia from "../pages/farmacia/DashboardFarmacia";
import HomeFarmacia from "../pages/farmacia/HomeFarmacia";
import Recetas from "../pages/farmacia/Recetas";
import Inventario from "../pages/farmacia/Inventario";
import Medicamentos from "../pages/farmacia/Medicamentos";
import AgregarMedicamento from "../pages/farmacia/AgregarMedicamento";
import Distribuidores from "../pages/farmacia/Distribuidores";

export default function FarmaciaRoutes(){
    return(
        <Routes>
            <Route path="dashboard" element={<DashboardFarmacia />}/>
            <Route path="Home" element={<HomeFarmacia />}/>
            <Route path="RecetasMedicas" element={<Recetas />}/>
            <Route path="inventario" element={<Inventario />}/>
            <Route path="medicamentos" element={<Medicamentos />}/>
            <Route path="AgregarMedicamento" element={<AgregarMedicamento/>}/>
            <Route path="Distribuidores" element={<Distribuidores/>}/>
        </Routes>
    );
}