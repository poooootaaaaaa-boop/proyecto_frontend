import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LogoutModal({ open, handleClose }) {

  const navigate = useNavigate();


const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

  } catch (error) {
    console.log("Error al cerrar sesión", error);
  }

  // limpiar frontend SIEMPRE
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  navigate("/login");
  window.location.reload();
};

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 1
        }
      }}
    >
      <DialogTitle fontWeight="bold">
        Confirmar cierre de sesión
      </DialogTitle>

      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas cerrar sesión?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ pb: 2, pr: 3 }}>

        <Button
          onClick={handleClose}
          variant="outlined"
        >
          Cancelar
        </Button>

        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
        >
          Cerrar sesión
        </Button>

      </DialogActions>
    </Dialog>
  );
}