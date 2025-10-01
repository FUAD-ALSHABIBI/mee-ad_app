"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import {
  addDays,
  addMinutes,
  format,
  getDay,
  isAfter,
  isBefore,
  isToday,
  parse,
  isValid,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/supa";

interface WorkingHour {
  id: string;
  business_id: string;
  day_of_week: number;
  is_open: boolean;
  start_time: string | null;
  end_time: string | null;
}

interface DateTimeSelectionProps {
  businessId: string;
  serviceDuration: number;
  selectedDate: string;
  selectedTime: string;
  updateBookingData: (data: { date: string; time: string }) => void;
  nextStep: () => void;
  prevStep: () => void;
}

type TimeSlot = {
  value: string;
  label: string;
  isBooked: boolean;
};


const parseTimeString = (timeString: string | null, referenceDate: Date): Date | null => {
  if (!timeString) {
    return null;
  }

  const normalizedValue = timeString.trim();
  const formats = ["HH:mm:ss", "HH:mm"];

  for (const pattern of formats) {
    const parsedTime = parse(normalizedValue, pattern, referenceDate);
    if (isValid(parsedTime)) {
      return parsedTime;
    }
  }

  const [hoursString, minutesString, secondsString] = normalizedValue.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  const seconds = secondsString !== undefined ? Number(secondsString) : 0;

  if (Number.isFinite(hours) && Number.isFinite(minutes)) {
    const result = new Date(referenceDate);
    result.setHours(hours, minutes, Number.isFinite(seconds) ? seconds : 0, 0);
    return result;
  }

  return null;
};

const normalizeTimeValue = (timeString: string | null, referenceDate: Date): string | null => {
  const parsedTime = parseTimeString(timeString, referenceDate);
  return parsedTime ? format(parsedTime, "HH:mm") : null;
};

const notNull = <T,>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

const supabase = getSupabaseBrowserClient();

const WINDOW_SIZE = 7;
const WINDOW_SHIFT = 5;

const DateTimeSelection = ({
  businessId,
  serviceDuration,
  selectedDate,
  selectedTime,
  updateBookingData,
  nextStep,
  prevStep,
}: DateTimeSelectionProps) => {
  const intl = useIntl();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [activeDate, setActiveDate] = useState<string>(() =>
    selectedDate || format(new Date(), "yyyy-MM-dd")
  );
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingWorkingHours, setIsLoadingWorkingHours] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    if (selectedDate && selectedDate !== activeDate) {
      setActiveDate(selectedDate);
    }
  }, [activeDate, selectedDate]);

  useEffect(() => {
    if (!businessId) {
      setWorkingHours([]);
      setIsLoadingWorkingHours(false);
      return;
    }

    let cancelled = false;

    const loadWorkingHours = async () => {
      setIsLoadingWorkingHours(true);

      try {
        const { data, error } = await supabase
          .from("working_hours")
          .select("*")
          .eq("business_id", businessId);

        if (error) {
          throw error;
        }

        if (!cancelled) {
          setWorkingHours(data ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching working hours:", error);
          setWorkingHours([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingWorkingHours(false);
        }
      }
    };

    loadWorkingHours();

    return () => {
      cancelled = true;
    };
  }, [businessId]);

  useEffect(() => {
    if (workingHours.length === 0) {
      setAvailableDates([]);
      return;
    }

    const today = new Date();
    const dates: Date[] = [];

    for (let offset = 0; offset < 21; offset += 1) {
      const date = addDays(today, offset);
      const dayOfWeek = getDay(date);
      const dayEntries = workingHours.filter(
        (workingHour) => workingHour.day_of_week === dayOfWeek
      );
      const hasOpenIntervals = dayEntries.some((workingHour) => {
        if (
          !workingHour.is_open ||
          !workingHour.start_time ||
          !workingHour.end_time
        ) {
          return false;
        }

        const start = parseTimeString(workingHour.start_time, date);
        const end = parseTimeString(workingHour.end_time, date);

        return Boolean(start && end && isBefore(start, end));
      });

      if (hasOpenIntervals) {
        dates.push(date);
      }
    }

    setAvailableDates(dates);

    if (dates.length === 0) {
      if (activeDate !== "") {
        setActiveDate("");
      }
      updateBookingData({ date: "", time: "" });
      return;
    }

    const activeIsValid = dates.some(
      (dateItem) => format(dateItem, "yyyy-MM-dd") === activeDate
    );

    if (!activeIsValid) {
      const fallback = format(dates[0], "yyyy-MM-dd");
      setActiveDate(fallback);
      updateBookingData({ date: fallback, time: "" });
    }
  }, [activeDate, updateBookingData, workingHours]);

  useEffect(() => {
    if (visibleStartIndex > 0 && visibleStartIndex >= availableDates.length) {
      setVisibleStartIndex(Math.max(0, availableDates.length - WINDOW_SIZE));
    }
  }, [availableDates.length, visibleStartIndex]);

  useEffect(() => {
    if (availableDates.length === 0) {
      return;
    }

    const activeIndex = availableDates.findIndex(
      (date) => format(date, "yyyy-MM-dd") === activeDate
    );

    if (activeIndex === -1) {
      return;
    }

    if (activeIndex < visibleStartIndex) {
      setVisibleStartIndex(Math.max(0, activeIndex));
    } else if (activeIndex >= visibleStartIndex + WINDOW_SIZE) {
      setVisibleStartIndex(Math.max(0, activeIndex - WINDOW_SIZE + 1));
    }
  }, [activeDate, availableDates, visibleStartIndex]);

  useEffect(() => {
    if (!businessId || !activeDate) {
      setBookedSlots([]);
      return;
    }

    let cancelled = false;
    const referenceDate = parse(activeDate, "yyyy-MM-dd", new Date());

    const loadAppointments = async () => {
      setIsLoadingSlots(true);

      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("appointment_time")
          .eq("business_id", businessId)
          .eq("appointment_date", activeDate)
          .in("status", ["new", "confirmed"]);

        if (error) {
          throw error;
        }

        if (!cancelled) {
          const normalizedSlots = (data ?? [])
            .map((appointment: { appointment_time: string | null }) =>
              normalizeTimeValue(appointment.appointment_time, referenceDate)
            )
            .filter(notNull);

          setBookedSlots(normalizedSlots);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching appointments:", error);
          setBookedSlots([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSlots(false);
        }
      }
    };

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [activeDate, businessId]);

  const activeDaySummary = useMemo(() => {
    if (!activeDate) {
      return {
        dayDate: null as Date | null,
        dayIntervals: [] as WorkingHour[],
        hasDefinedHours: false,
      };
    }

    const date = parse(activeDate, "yyyy-MM-dd", new Date());
    const dayOfWeek = getDay(date);
    const dayEntries = workingHours.filter(
      (workingHour) => workingHour.day_of_week === dayOfWeek
    );
    const openIntervals = dayEntries.filter(
      (workingHour) =>
        workingHour.is_open &&
        workingHour.start_time &&
        workingHour.end_time
    );

    return {
      dayDate: date,
      dayIntervals: openIntervals,
      hasDefinedHours: dayEntries.length > 0,
    };
  }, [activeDate, workingHours]);

  const {
    dayDate: activeDayDate,
    dayIntervals: activeDayIntervals,
    hasDefinedHours: hasDefinedHoursForActiveDay,
  } = activeDaySummary;

  const isClosedDay = hasDefinedHoursForActiveDay && activeDayIntervals.length === 0;
  const loading = isLoadingWorkingHours || isLoadingSlots;
  const showEmptyState = !loading && availableTimes.length === 0;
  const canGoPrevious = visibleStartIndex > 0;
  const canGoNext = visibleStartIndex + WINDOW_SIZE < availableDates.length;

  useEffect(() => {
    if (!activeDate) {
      setAvailableTimes([]);
      return;
    }

    const normalizedDuration =
      Number.isFinite(serviceDuration) && serviceDuration > 0
        ? serviceDuration
        : 30;

    const intervals = activeDayIntervals
      .map((workingHour) => {
        if (!activeDayDate) {
          return null;
        }

        const start = parseTimeString(workingHour.start_time, activeDayDate);
        const end = parseTimeString(workingHour.end_time, activeDayDate);

        if (!start || !end || !isBefore(start, end)) {
          return null;
        }

        return { start, end };
      })
      .filter(notNull)
      .sort((first, second) => first.start.getTime() - second.start.getTime());

    if (!activeDayDate || intervals.length === 0) {
      setAvailableTimes([]);
      return;
    }

    const now = new Date();
    const slots: TimeSlot[] = [];

    intervals.forEach(({ start, end }) => {
      let pointer = new Date(start.getTime());

      while (!isAfter(addMinutes(pointer, normalizedDuration), end)) {
        const inPast = isToday(pointer) && isBefore(pointer, now);
        const value = format(pointer, "HH:mm");
        const label = intl.formatTime(pointer, {
          hour: "numeric",
          minute: "2-digit",
        });
        const isBooked = bookedSlots.includes(value);

        if (!inPast) {
          slots.push({ value, label, isBooked });
        }

        pointer = addMinutes(pointer, normalizedDuration);
      }
    });

    setAvailableTimes(slots);
  }, [activeDate, activeDayDate, activeDayIntervals, bookedSlots, intl, serviceDuration]);

  useEffect(() => {
    if (!selectedTime) {
      return;
    }

    const stillAvailable = availableTimes.some(
      (slot) => slot.value === selectedTime && !slot.isBooked
    );

    if (!stillAvailable) {
      updateBookingData({ date: activeDate, time: "" });
    }
  }, [activeDate, availableTimes, selectedTime, updateBookingData]);

  const timezoneLabel = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const visibleDates = useMemo(
    () => availableDates.slice(visibleStartIndex, visibleStartIndex + WINDOW_SIZE),
    [availableDates, visibleStartIndex]
  );

  const moveWindow = useCallback(
    (direction: "prev" | "next") => {
      setVisibleStartIndex((current) => {
        if (direction === "prev") {
          return Math.max(0, current - WINDOW_SHIFT);
        }

        const maxStart = Math.max(0, availableDates.length - WINDOW_SIZE);
        return Math.min(maxStart, current + WINDOW_SHIFT);
      });
    },
    [availableDates.length]
  );

  const handleSelectDate = useCallback(
    (dateValue: string) => {
      setActiveDate(dateValue);
      updateBookingData({ date: dateValue, time: "" });
    },
    [updateBookingData]
  );

  const handleSelectTime = useCallback(
    (value: string) => {
      const slot = availableTimes.find(
        (item) => item.value === value && !item.isBooked
      );

      if (slot) {
        updateBookingData({ date: activeDate, time: value });
      }
    },
    [activeDate, availableTimes, updateBookingData]
  );

  const handleContinue = useCallback(() => {
    const slot = availableTimes.find(
      (item) => item.value === selectedTime && !item.isBooked
    );

    if (activeDate && slot) {
      nextStep();
    }
  }, [activeDate, availableTimes, nextStep, selectedTime]);

  if (isLoadingWorkingHours && availableDates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage({ id: "booking.step2.title" })}
        </h2>
        <p className="mt-2 text-gray-600">
          {intl.formatMessage({
            id: "booking.step2.subtitle",
            defaultMessage: "Pick a date and time that works for you.",
          })}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          {intl.formatMessage(
            {
              id: "booking.step2.timezoneNotice",
              defaultMessage: "Times are shown in {timezone}",
            },
            { timezone: timezoneLabel }
          )}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">
          {intl.formatMessage({
            id: "booking.step2.dateLabel",
            defaultMessage: "Select a date",
          })}
        </h3>

        {availableDates.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-center text-gray-600">
            {intl.formatMessage({ id: "booking.step2.noAvailability" })}
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center">
              <button
                type="button"
                className={`absolute left-0 z-10 flex h-full items-center justify-center px-2 transition ${
                  canGoPrevious
                    ? "text-gray-500 hover:text-teal-600"
                    : "cursor-not-allowed text-gray-300"
                }`}
                onClick={() => moveWindow("prev")}
                disabled={!canGoPrevious}
                aria-label={intl.formatMessage({
                  id: "common.previous",
                  defaultMessage: "Previous",
                })}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="no-scrollbar flex w-full overflow-x-auto py-2 pl-8 pr-8">
                {visibleDates.map((date) => {
                  const value = format(date, "yyyy-MM-dd");
                  const isActive = activeDate === value;

                  return (
                    <div key={value} className="flex-shrink-0 px-1">
                      <button
                        type="button"
                        onClick={() => handleSelectDate(value)}
                        aria-pressed={isActive}
                        aria-label={intl.formatDate(date, { dateStyle: "full" })}
                        className={`flex h-14 w-20 flex-col items-center justify-center rounded-lg border text-sm font-medium transition ${
                          isActive
                            ? "border-teal-500 bg-teal-50 text-teal-700 shadow"
                            : "border-gray-200 bg-white hover:border-teal-300 hover:text-teal-600"
                        }`}
                      >
                        <span className="text-xs font-medium text-gray-500">
                          {intl.formatDate(date, { weekday: "short" })}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {intl.formatDate(date, { day: "numeric" })}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className={`absolute right-0 z-10 flex h-full items-center justify-center px-2 transition ${
                  canGoNext
                    ? "text-gray-500 hover:text-teal-600"
                    : "cursor-not-allowed text-gray-300"
                }`}
                onClick={() => moveWindow("next")}
                disabled={!canGoNext}
                aria-label={intl.formatMessage({
                  id: "common.next",
                  defaultMessage: "Next",
                })}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">
          {intl.formatMessage({
            id: "booking.step2.timeLabel",
            defaultMessage: "Select a time",
          })}
        </h3>

        {loading && availableTimes.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-teal-500" />
          </div>
        ) : showEmptyState ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-center text-gray-600">
            <p className="font-medium">
              {isClosedDay
                ? intl.formatMessage({
                    id: "booking.step2.closed",
                    defaultMessage: "The business is closed on this day.",
                  })
                : intl.formatMessage({ id: "booking.step2.noAvailability" })}
            </p>
            <p className="mt-1 text-sm">
              {intl.formatMessage({
                id: "booking.step2.selectDifferentDate",
                defaultMessage: "Please choose another date to see available times.",
              })}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {availableTimes.map((slot) => {
              const isActive = selectedTime === slot.value;

              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => handleSelectTime(slot.value)}
                  disabled={slot.isBooked}
                  aria-pressed={isActive}
                  className={`flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition ${
                    slot.isBooked
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : isActive
                      ? "border-teal-500 bg-teal-50 text-teal-700 shadow"
                      : "border-gray-200 bg-white hover:border-teal-300 hover:text-teal-600"
                  }`}
                >
                  <span>{slot.label}</span>
                  {slot.isBooked && (
                    <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {intl.formatMessage({
                        id: "booking.step2.slotBooked",
                        defaultMessage: "Booked",
                      })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" className="btn btn-outline" onClick={prevStep}>
          {intl.formatMessage({ id: "common.previous" })}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!selectedTime || loading}
          onClick={handleContinue}
        >
          {intl.formatMessage({ id: "common.next" })}
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection;


