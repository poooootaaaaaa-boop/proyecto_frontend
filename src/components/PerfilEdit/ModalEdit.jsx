import React, { useEffect, useState } from "react";

const ModalEdit = ({
  isOpen,
  onClose,
  onConfirm,
  confirmMessage = "¿Estás seguro de guardar los cambios?",
  successMessage = "¡Se guardaron los cambios con éxito!"
}) => {

  const [isSuccess, setIsSuccess] = useState(false);

  // Auto cerrar después de 3 segundos cuando sea éxito
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm(); // Ejecuta función de guardar
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!isSuccess ? (
          <>
            <h3>{confirmMessage}</h3>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={handleClose}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleConfirm}>
                Guardar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="check-icon">✓</div>
            <h3>{successMessage}</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalEdit;