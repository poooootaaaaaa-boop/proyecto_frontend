import { Dialog, DialogContent, Typography, Box, Grow } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./confirm.css";

export default function SuccessModal({ open, onClose, redirectTo = "/citas" }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose?.();        // cerrar modal
        navigate(redirectTo); // redirigir
      }, 3000); // 5 segundos

      return () => clearTimeout(timer);
    }
  }, [open, navigate, onClose, redirectTo]);

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

          </Box>
        </DialogContent>
      </Grow>
    </Dialog>
  );
}