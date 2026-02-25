import { Routes, Route } from "react-router-dom";
import DashboardFarmacia from "../pages/farmacia/DashboardFarmacia";

export default function FarmaciaRoutes(){
    return(
        <Routes>
            <Route path="dashboard" element={<DashboardFarmacia />}/>
        </Routes>
    );
}