/*
Component Summary: Captures weekly working hours as part of the setup wizard.
Steps:
1. Maintains local working hour state while toggling each day open or closed.
2. Adds, updates, and removes time slots for selected days with lucide icons for feedback.
3. Persists the updated schedule back into the shared setup data before advancing.
Component Dependencies: None
External Libs: react, react-intl, lucide-react
*/

import { useState } from "react";
import { useIntl } from "react-intl";
import { Plus, Trash2 } from "lucide-react";

const WorkingHoursStep = ({ data, updateData, nextStep, prevStep }: any) => {
  const intl = useIntl();
  const [workingHours, setWorkingHours] = useState<any>(data.workingHours);

  const handleToggleDay = (day: keyof any) => {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        isOpen: !workingHours[day].isOpen,
        slots: workingHours[day].isOpen ? [] : [{ start: "09:00", end: "17:00" }],
      },
    });
  };

  const handleAddTimeSlot = (day: keyof any) => {
    const slots = [...workingHours[day].slots, { start: "09:00", end: "17:00" }];
    setWorkingHours({
      ...workingHours,
      [day]: { ...workingHours[day], slots },
    });
  };

  const handleRemoveTimeSlot = (day: keyof any, index: number) => {
    const slots = [...workingHours[day].slots];
    slots.splice(index, 1);
    setWorkingHours({
      ...workingHours,
      [day]: { ...workingHours[day], slots },
    });
  };

  const handleUpdateTimeSlot = (
    day: keyof any,
    index: number,
    field: keyof any,
    value: string
  ) => {
    const slots = [...workingHours[day].slots];
    slots[index] = { ...slots[index], [field]: value };
    setWorkingHours({
      ...workingHours,
      [day]: { ...workingHours[day], slots },
    });
  };

  const handleContinue = () => {
    updateData({ workingHours });
    nextStep();
  };

  const days: Array<{ id: keyof any; label: string }> = [
    { id: "monday", label: intl.formatMessage({ id: "wizard.step3.monday", defaultMessage: "Monday" }) },
    { id: "tuesday", label: intl.formatMessage({ id: "wizard.step3.tuesday", defaultMessage: "Tuesday" }) },
    { id: "wednesday", label: intl.formatMessage({ id: "wizard.step3.wednesday", defaultMessage: "Wednesday" }) },
    { id: "thursday", label: intl.formatMessage({ id: "wizard.step3.thursday", defaultMessage: "Thursday" }) },
    { id: "friday", label: intl.formatMessage({ id: "wizard.step3.friday", defaultMessage: "Friday" }) },
    { id: "saturday", label: intl.formatMessage({ id: "wizard.step3.saturday", defaultMessage: "Saturday" }) },
    { id: "sunday", label: intl.formatMessage({ id: "wizard.step3.sunday", defaultMessage: "Sunday" }) },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {intl.formatMessage({ id: "wizard.step3.title", defaultMessage: "Set Your Working Hours" })}
        </h2>
        <p className="mt-1 text-gray-600">
          {intl.formatMessage({ id: "wizard.step3.subtitle", defaultMessage: "Choose available days and time slots" })}
        </p>
      </div>

      <div className="space-y-4">
        {days.map((day: any) => (
          <div key={day.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{day.label}</span>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">
                  {workingHours[day.id].isOpen
                    ? intl.formatMessage({ id: "wizard.step3.open", defaultMessage: "Open" })
                    : intl.formatMessage({ id: "wizard.step3.closed", defaultMessage: "Closed" })}
                </span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={workingHours[day.id].isOpen}
                    onChange={() => handleToggleDay(day.id)}
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-teal-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-teal-300"></div>
                </label>
              </div>
            </div>

            {workingHours[day.id].isOpen && (
              <div className="mt-4 space-y-3">
                {workingHours[day.id].slots.map((slot: any, index: any) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="time"
                      className="input"
                      value={slot.start}
                      onChange={(e) => handleUpdateTimeSlot(day.id, index, "start", e.target.value)}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      className="input"
                      value={slot.end}
                      onChange={(e) => handleUpdateTimeSlot(day.id, index, "end", e.target.value)}
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveTimeSlot(day.id, index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="mt-2 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                  onClick={() => handleAddTimeSlot(day.id)}
                >
                  <Plus size={16} className="mr-1" />
                  {intl.formatMessage({ id: "wizard.step3.break", defaultMessage: "Add Break/Slot" })}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" className="btn btn-outline" onClick={prevStep}>
          {intl.formatMessage({ id: "common.previous", defaultMessage: "Previous" })}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleContinue}>
          {intl.formatMessage({ id: "common.next", defaultMessage: "Next" })}
        </button>
      </div>
    </div>
  );
};

export default WorkingHoursStep;

