import Layout from "../components/layout/Layout";
import { Grid, Box, Typography } from "@mui/material";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import NextAppointmentCard from "../components/dashboard/NextAppointmentCard";
import MedicationsCard from "../components/dashboard/MedicationsCard";
import AlertsCard from "../components/dashboard/AlertsCard";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {

  return (

    <Layout>

      <Box sx={{maxWidth: 1200, mx: "auto",}}>

        {/* Welcome */}
        <WelcomeCard />

        {/* Cards */}
        <Grid  container spacing={3} mt={2} sx={{ alignItems: "stretch" }}>

          <Grid item xs={12} md={4} sx={{ display: "flex" }}>
            <NextAppointmentCard />
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: "flex" }}>
            <MedicationsCard />
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: "flex" }}>
            <AlertsCard />
          </Grid>

        </Grid>

        {/* Quick Actions */}
        <Typography mt={5} mb={2} fontWeight={700} fontSize={22} color="text.primary" >
          Acciones Rápidas
        </Typography>

        <QuickActions />

      </Box>

    </Layout>

  );

}