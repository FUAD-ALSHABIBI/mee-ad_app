"use client";
// lib/setup.ts
import { createBusiness } from "./business";
import { createService } from "./services";
import { BusinessSetupData, Business } from "./interfaces";
import { getSupabaseBrowserClient } from "./supabase/supa";

const supabase = getSupabaseBrowserClient();

type WorkingHoursMap = BusinessSetupData["workingHours"];
type DayKey = keyof WorkingHoursMap;
type DaySchedule = WorkingHoursMap[DayKey];

const DAY_NAME_TO_INDEX: Record<DayKey, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

interface WorkingHourInsertPayload {
  business_id: string;
  day_of_week: number;
  is_open: boolean;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
}

const normalizeSlotTime = (value: string | null | undefined): { formatted: string; seconds: number } | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  const segments = trimmed.split(":");

  if (segments.length < 2) {
    return null;
  }

  const [rawHours, rawMinutes, rawSeconds] = segments;
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);
  const seconds = rawSeconds !== undefined ? Number(rawSeconds) : 0;

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return null;
  }

  const formatted = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return {
    formatted,
    seconds: hours * 3600 + minutes * 60 + seconds,
  };
};

const dedupeSlots = (slots: Array<{ start: string; end: string }>) => {
  const seen = new Set<string>();

  return slots.filter((slot) => {
    const signature = `${slot.start}-${slot.end}`;

    if (seen.has(signature)) {
      return false;
    }

    seen.add(signature);
    return true;
  });
};

const buildWorkingHourPayloads = (
  businessId: string,
  workingHours: BusinessSetupData["workingHours"]
): WorkingHourInsertPayload[] => {
  const rows: WorkingHourInsertPayload[] = [];
  const now = new Date().toISOString();

  (Object.entries(workingHours) as Array<[DayKey, DaySchedule]>).forEach(([dayName, schedule]) => {
    const dayIndex = DAY_NAME_TO_INDEX[dayName];

    if (dayIndex === undefined) {
      return;
    }

    const sanitizedSlots = dedupeSlots(
      (schedule.slots || [])
        .map((slot) => {
          const normalizedStart = normalizeSlotTime(slot?.start ?? null);
          const normalizedEnd = normalizeSlotTime(slot?.end ?? null);

          if (!normalizedStart || !normalizedEnd) {
            return null;
          }

          if (normalizedStart.seconds >= normalizedEnd.seconds) {
            return null;
          }

          return {
            start: normalizedStart.formatted,
            end: normalizedEnd.formatted,
          };
        })
        .filter((slot): slot is { start: string; end: string } => Boolean(slot))
    );

    if (!schedule.isOpen || sanitizedSlots.length === 0) {
      rows.push({
        business_id: businessId,
        day_of_week: dayIndex,
        is_open: false,
        start_time: null,
        end_time: null,
        created_at: now,
      });
      return;
    }

    sanitizedSlots.forEach(({ start, end }) => {
      rows.push({
        business_id: businessId,
        day_of_week: dayIndex,
        is_open: true,
        start_time: start,
        end_time: end,
        created_at: now,
      });
    });
  });

  return rows;
};

const persistWorkingHours = async (
  businessId: string,
  workingHours: BusinessSetupData["workingHours"]
): Promise<void> => {
  const rows = buildWorkingHourPayloads(businessId, workingHours);

  if (rows.length === 0) {
    return;
  }

  const { error } = await supabase.from("working_hours").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
};


export async function completeSetup(userName: string, setupData: BusinessSetupData): Promise<Business | null> {
  try {
    const bookingUrl = `${userName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    const business = await createBusiness({
      name: setupData.businessType,
      business_type: setupData.businessType,
      booking_url: bookingUrl,
      description: `Professional ${setupData.businessType} services`,
    });

    if (!business) throw new Error("Failed to create business");

    await persistWorkingHours(business.id, setupData.workingHours);

    for (const service of setupData.services) {
      await createService(business, service);
    }

    return business;
  } catch (error: any) {
    console.error("❌ Error completing setup:", error.message);
    return null;
  }
}
