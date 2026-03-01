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
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
        }}
      >
        {/*  Welcome */}
        <Box mb={3}>
          <WelcomeCard />
        </Box>

        {/*  Cards principales */}
        <Grid
          container
          spacing={12}
          sx={{
            alignItems: "stretch",
          }}
        >
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

        {/*  Quick Actions */}
        <Box mt={6}>
          <Typography
            mb={3}
            fontWeight={800}
            fontSize={24}
            color="text.primary"
          >
            Acciones Rápidas
          </Typography>

          <QuickActions />
        </Box>
      </Box>
    </Layout>
  );
}