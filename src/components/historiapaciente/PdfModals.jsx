import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

export default function PdfModals({
  openFullModal,
  setOpenFullModal,
  openConsultaModal,
  setOpenConsultaModal,
  openAlert,
  setOpenAlert,
  handleDownloadFullPDF,
  handleDownloadConsultaPDF,
    //  NUEVAS
  openUploadModal,
  setOpenUploadModal,
  confirmUploadFiles,
}) {
  return (
    <>
      {/* MODAL HISTORIAL COMPLETO */}
      <Dialog open={openFullModal} onClose={() => setOpenFullModal(false)}>
        <DialogTitle>Descargar historial completo</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Deseas descargar tu historial médico completo en PDF?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFullModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleDownloadFullPDF}>
            Descargar
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL CONSULTA */}
      <Dialog open={openConsultaModal} onClose={() => setOpenConsultaModal(false)}>
        <DialogTitle>Descargar consulta</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Deseas descargar el PDF de esta consulta?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConsultaModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleDownloadConsultaPDF}>
            Descargar
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL CONFIRMAR SUBIDA */}
<Dialog open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
  <DialogTitle>Subir archivo</DialogTitle>
  <DialogContent>
    <Typography>
      ¿Estás seguro de subir el archivo?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenUploadModal(false)}>
      Cancelar
    </Button>
    <Button variant="contained" onClick={confirmUploadFiles}>
      Sí, subir
    </Button>
  </DialogActions>
</Dialog>

      {/* ALERTA DE ÉXITO */}
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled">
          El PDF se descargó con éxito
        </Alert>
      </Snackbar>
    </>
  );
}