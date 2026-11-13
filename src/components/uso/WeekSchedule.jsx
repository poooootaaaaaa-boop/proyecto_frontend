import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import isoWeek from "dayjs/plugin/isoWeek";
import "./WeekSchedule.css";

dayjs.locale("es");
dayjs.extend(isoWeek);

const DEFAULT_HOURS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"];

// Rangos del filtro por horario del día. `from` y `to` son horas en formato 24h
// (ambas incluidas: to: 5 abarca hasta las 05:59).
const DEFAULT_TIME_RANGES = [
  { label: "00:00 - 05:00", from: 0, to: 5 },
  { label: "06:00 - 10:00", from: 6, to: 10 },
  { label: "11:00 - 15:00", from: 11, to: 15 },
  { label: "16:00 - 21:00", from: 16, to: 21 },
  { label: "22:00 - 23:59", from: 22, to: 23 },
];

// "02:30 PM" -> 14   |   "14:30" -> 14
const hour24 = (label) => {
  const m = /(\d{1,2}):(\d{2})\s*([AP]M)?/i.exec(label);
  if (!m) return 0;
  let h = Number(m[1]);
  const period = m[3]?.toUpperCase();
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h;
};

const minutes = (label) => Number(/:(\d{2})/.exec(label)?.[1] ?? 0);

/**
 * WeekSchedule - vista semanal reutilizable (lunes a viernes por defecto).
 *
 * Props:
 * - title / subtitle     Textos del encabezado. Usa `title={null}` para ocultarlo.
 * - hours                Horas a mostrar, ej. ["08:00 AM", "09:00 AM"].
 * - timeRanges          Rangos del filtro por horario: [{ label, from, to }] con horas 24h
 *                        (to incluido). Por defecto 00-05, 06-10, 11-15, 16-21 y 22-23.
 *                        Usa [] para desactivar el filtro. Solo se muestran los rangos con horas.
 * - daysCount            Cantidad de días desde el lunes (5 = L-V, 6 = L-S, 7 = L-D).
 * - appointments         Citas ocupadas: [{ date: "DD MMMM YYYY", time: "08:00 AM" }].
 * - dateFormat           Formato con el que se compara/entrega la fecha.
 * - onSelectSlot         Callback al elegir un horario libre: ({ date, time, day }) => void.
 * - selectedSlot         Selección controlada (opcional): { date, time }.
 * - readOnly             Si es true, los horarios no se pueden seleccionar (solo ver agenda).
 * - disablePast          Bloquea horarios anteriores al momento actual.
 * - isSlotDisabled       Función extra para bloquear: (day, hour) => boolean.
 * - renderBookedSlot     Contenido personalizado para un horario ocupado: (appointment) => node.
 * - availableLabel       Texto de acción en horario libre (default "Reservar").
 * - initialDate          Fecha que define la semana inicial.
 * - onWeekChange         Callback al cambiar de semana: (startOfWeek: dayjs) => void.
 */
export default function WeekSchedule({
  title = "Agenda Médica",
  subtitle = "Seleccione el horario disponible",
  hours = DEFAULT_HOURS,
  timeRanges = DEFAULT_TIME_RANGES,
  daysCount = 5,
  appointments = [],
  dateFormat = "DD MMMM YYYY",
  onSelectSlot,
  selectedSlot: controlledSelected,
  readOnly = false,
  disablePast = false,
  isSlotDisabled,
  renderBookedSlot,
  availableLabel = "Reservar",
  initialDate,
  onWeekChange,
}) {
  const [currentWeek, setCurrentWeek] = useState(
    initialDate ? dayjs(initialDate) : dayjs()
  );
  const [internalSelected, setInternalSelected] = useState(null);

  // ----- Filtro por rangos de horario -----
  const [group, setGroup] = useState(null); // índice en timeRanges o "all"

  // Solo los rangos que realmente tienen horas del doctor
  const availableRanges = timeRanges
    .map((r, index) => ({
      ...r,
      index,
      hours: hours.filter((h) => {
        const hr = hour24(h);
        return hr >= r.from && hr <= r.to;
      }),
    }))
    .filter((r) => r.hours.length > 0);

  const hasGroups = availableRanges.length > 1;

  // Si no hay selección válida, se usa el primer rango disponible
  const activeGroup =
    !hasGroups || group === "all"
      ? "all"
      : availableRanges.some((r) => r.index === group)
      ? group
      : availableRanges[0].index;

  const visibleHours =
    activeGroup === "all"
      ? hours
      : availableRanges.find((r) => r.index === activeGroup).hours;

  const startOfWeek = currentWeek.startOf("isoWeek");
  const endOfWeek = startOfWeek.add(daysCount - 1, "day");
  const days = Array.from({ length: daysCount }, (_, i) =>
    startOfWeek.add(i, "day")
  );

  const changeWeek = (offset) => {
    const next = currentWeek.add(offset, "week");
    setCurrentWeek(next);
    onWeekChange?.(next.startOf("isoWeek"));
  };

  // Si el padre controla la selección, se usa esa; si no, la interna.
  const selected = controlledSelected ?? internalSelected;

  const parseHour = (day, hour) =>
    day.hour(hour24(hour)).minute(minutes(hour)).second(0);

  return (
    <Box className="ws-container">
      {title && (
        <Box className="ws-header">
          <Typography variant="h5" fontWeight={800}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" fontSize={13}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Paper className="ws-card">
        {/* Barra de semana */}
        <Box className="ws-bar">
          <Button onClick={() => changeWeek(-1)} aria-label="Semana anterior">
            {"<"}
          </Button>

          <Typography fontWeight={700}>
            Semana del {startOfWeek.format("DD")} -{" "}
            {endOfWeek.format("DD [de] MMMM")}
          </Typography>

          <Button onClick={() => changeWeek(1)} aria-label="Semana siguiente">
            {">"}
          </Button>
        </Box>

        {/* Filtro por rangos de horario */}
        {hasGroups && (
          <Box className="ws-filter">
            <span className="ws-filter-label">Horario:</span>
            <ToggleButtonGroup
              value={activeGroup}
              exclusive
              size="small"
              onChange={(_, value) => value !== null && setGroup(value)}
              aria-label="Filtrar horas por rango"
            >
              {availableRanges.map((r) => (
                <ToggleButton
                  key={r.index}
                  value={r.index}
                  className="ws-filter-btn"
                >
                  <span className="ws-filter-num">{r.label}</span>
                  <span className="ws-filter-range">
                    {r.hours.length} {r.hours.length === 1 ? "horario" : "horarios"}
                  </span>
                </ToggleButton>
              ))}
              <ToggleButton value="all" className="ws-filter-btn">
                <span className="ws-filter-num">Todas</span>
                <span className="ws-filter-range">{hours.length} horarios</span>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Grid (con scroll horizontal en pantallas pequeñas) */}
        <Box className="ws-scroll">
          <Box
            className="ws-grid"
            style={{ "--ws-days": daysCount }}
          >
            <Box className="ws-hours-col">
              <div className="ws-hour-cell ws-header-cell">Hora</div>
              {visibleHours.map((h) => (
                <div key={h} className="ws-hour-cell">
                  {h}
                </div>
              ))}
            </Box>

            {days.map((day) => (
              <Box key={day.format("YYYY-MM-DD")} className="ws-day-col">
                <div className="ws-day-header">
                  <span>{day.format("dddd")}</span>
                  <strong>{day.format("DD")}</strong>
                </div>

                {visibleHours.map((hour) => {
                  const dateFormatted = day.format(dateFormat);
                  const key = `${day.format("YYYY-MM-DD")}-${hour}`;

                  const booked = appointments.find(
                    (a) => a.date === dateFormatted && a.time === hour
                  );
                  const isPast = disablePast && parseHour(day, hour).isBefore(dayjs());
                  const isDisabled =
                    !!booked || isPast || !!isSlotDisabled?.(day, hour);

                  const isSelected =
                    selected?.date === dateFormatted && selected?.time === hour;

                  const clickable = !isDisabled && !readOnly;

                  const handleSelect = () => {
                    if (!clickable) return;
                    setInternalSelected({ date: dateFormatted, time: hour });
                    onSelectSlot?.({ date: dateFormatted, time: hour, day });
                  };

                  const className = [
                    "ws-slot",
                    isSelected && "selected",
                    booked && "booked",
                    isDisabled && !booked && "disabled",
                    readOnly && "readonly",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div
                      key={key}
                      className={className}
                      role={clickable ? "button" : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onClick={handleSelect}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelect();
                        }
                      }}
                    >
                      {booked ? (
                        renderBookedSlot ? (
                          renderBookedSlot(booked)
                        ) : (
                          <span className="ws-slot-occupied">Ocupado</span>
                        )
                      ) : (
                        <>
                          <span className="ws-slot-hour">{hour}</span>
                          {!readOnly && !isDisabled && (
                            <span className="ws-slot-action">
                              {isSelected ? "Seleccionado" : availableLabel}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}