import { createContext, useContext, useState } from "react";
import dayjs from "dayjs";

const AppointmentContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function AppointmentProvider({ children }) {

  const [appointments, setAppointments] = useState([]);

  // 🔹 Cargar citas desde Laravel
  const loadAppointments = async (paciente_id) => {
    try {
      const res = await fetch(`${API_URL}/citas/paciente/${paciente_id}`);
      const data = await res.json();

      const citasFormateadas = data.map(c => {
        const fecha = dayjs(c.fecha_fin);

        return {
          id: c.id,
          date: fecha.format("DD MMMM YYYY"),
          time: fecha.format("hh:mm A"),
        };
      });

      setAppointments(citasFormateadas);

    } catch (error) {
      console.error("Error cargando citas:", error);
    }
  };

  const loadFutureAppointments = async (paciente_id) => {
  try {
    const res = await fetch(`${API_URL}/citas/paciente/${paciente_id}/futuras`);
    const data = await res.json();

    const citasFormateadas = data.map(c => {
      const fecha = dayjs(c.fecha_fin);

      return {
        id: c.id,
        doctor: c.doctor?.usuario?.nombre, //  FIX
    specialty: c.doctor?.especialidad?.nombre,
        avatar: c.doctor?.usuario?.foto_url, //  FIX
        date: fecha.format("DD MMMM YYYY"),
        time: fecha.format("hh:mm A"),
      };
    });

    setAppointments(citasFormateadas);

  } catch (error) {
    console.error("Error cargando citas futuras:", error);
  }
};

  // 🔹 Agregar cita (después de confirmar)
  const addAppointment = (appt) => {
    setAppointments((prev) => [...prev, appt]);
  };

  // 🔹 Recargar después de agendar
  const reloadAppointments = async (paciente_id) => {
    await loadAppointments(paciente_id);
  };

  const updateAppointment = (updatedAppt) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === updatedAppt.id ? updatedAppt : appt
      )
    );
  };

  const deleteAppointment = (id) => {
    setAppointments((prev) =>
      prev.filter((appt) => appt.id !== id)
    );
  };
const loadAppointmentsByDoctor = async (doctor_id) => {
  try {
    const res = await fetch(`${API_URL}/citas-doctor/${doctor_id}`);
    const data = await res.json();

    const citasFormateadas = data.map(c => {
      const fecha = dayjs(c.fecha_fin); // IMPORTANTE

      return {
        id: c.id,
        date: fecha.format("DD MMMM YYYY"),
        time: fecha.format("hh:mm A"),
      };
    });

    setAppointments(citasFormateadas);

  } catch (error) {
    console.error("Error cargando citas del doctor:", error);
  }
};
  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        setAppointments,
        loadAppointmentsByDoctor,
        loadAppointments,
        loadFutureAppointments,
        reloadAppointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export const useAppointments = () => useContext(AppointmentContext);