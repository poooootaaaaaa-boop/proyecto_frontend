import { createContext, useContext, useState } from "react";

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);

  const addAppointment = (appt) => {
    setAppointments((prev) => [...prev, appt]);
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

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
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