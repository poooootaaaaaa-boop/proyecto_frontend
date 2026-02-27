import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ModalCancelarCita({
  open,
  onClose,
  onConfirm,
  appointment,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancelar Cita</DialogTitle>

      <DialogContent>
        <Typography>
          ¿Estás seguro que deseas cancelar la cita del{" "}
          <strong>{appointment?.date}</strong> a las{" "}
          <strong>{appointment?.time}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>No</Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
        >
          Sí, cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}