import * as React from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";

const holidays = [
  { date: "2026-01-26", name: "Republic Day" },
  { date: "2026-03-04", name: "Holi" },
  { date: "2026-08-15", name: "Independence Day" }
];

export const HolidayCalendarWidget = () => {

  const [currentMonth, setCurrentMonth] = React.useState(dayjs());

  const holidayDates = holidays.map(h => h.date);

  function CustomDay(props) {

    const { day, outsideCurrentMonth, ...other } = props;

    const formatted = day.format("YYYY-MM-DD");

    const isHoliday = holidayDates.includes(formatted);
    const isSunday = day.day() === 0;

    return (
      <Badge
        overlap="circular"
        badgeContent={isHoliday ? "●" : undefined}
        sx={{
          "& .MuiBadge-badge": {
            fontSize: "8px",
            color: "#16a34a"
          }
        }}
      >
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          sx={{
            height: 32,
            width: 32,
            fontSize: "0.75rem",

            ...(isHoliday && {
              color: "#16a34a",
              fontWeight: 600
            }),

            ...(isSunday && {
              color: "#ef4444"
            })
          }}
        />
      </Badge>
    );
  }

  const monthHolidays = holidays.filter((h) =>
    dayjs(h.date).month() === currentMonth.month() &&
    dayjs(h.date).year() === currentMonth.year()
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">

      {/* Calendar */}
      <DateCalendar
        onMonthChange={(newMonth) => setCurrentMonth(newMonth)}
        slots={{ day: CustomDay }}
        sx={{
          width: "100%",
          maxWidth: "100%",

          /* Header */
          "& .MuiPickersCalendarHeader-root": {
            padding: "0 4px",
            marginBottom: "4px"
          },

          "& .MuiPickersCalendarHeader-label": {
            fontSize: "0.85rem",
            fontWeight: 600
          },

          "& .MuiPickersArrowSwitcher-root": {
            gap: "2px"
          },

          /* Weekday labels */
          "& .MuiDayCalendar-weekDayLabel": {
            fontSize: "0.7rem"
          },

          /* Week rows */
          "& .MuiDayCalendar-weekContainer": {
            justifyContent: "space-between"
          },

          "& .MuiDayCalendar-root": {
            minHeight: "auto"
          },

          "& .MuiDayCalendar-monthContainer": {
            marginBottom: 0
          }
        }}
      />

      {/* Holidays */}
      <div className="mt-3">

        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Holidays This Month
        </h3>

        {monthHolidays.length === 0 ? (
          <div className="text-sm text-gray-400">
            No holidays this month
          </div>
        ) : (
          <div className="space-y-2">
            {monthHolidays.map((holiday, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm hover:bg-gray-50 p-1.5 rounded-md transition"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-700 font-medium">
                    {holiday.name}
                  </span>
                </div>

                <span className="text-xs text-gray-500">
                  {dayjs(holiday.date).format("DD MMM")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};