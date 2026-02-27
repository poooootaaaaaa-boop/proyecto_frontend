import { Dialog, DialogContent, Typography, Button, Box, Grow } from "@mui/material";
import "./confirm.css";

export default function SuccessModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: "10px",
        },
      }}
    >
      <Grow in={open} timeout={400}>
        <DialogContent>

          <Box className="modal-success-container">

            <Box className="check-circle modal-check">
              <span className="material-symbols-outlined success-icon">
                check_circle
              </span>
            </Box>

            <Typography className="modal-title">
              ¡Cita Confirmada!
            </Typography>

            <Typography className="modal-subtitle">
              Tu cita se ha guardado correctamente.
            </Typography>

            <Button
              className="confirm-btn"
              fullWidth
              onClick={onClose}
              sx={{ mt: 2 }}
            >
              Entendido
            </Button>

          </Box>

        </DialogContent>
      </Grow>
    </Dialog>
  );
}