import { type DateValue, Time } from "@internationalized/date"

export interface ScheduleDrawerProps {
    isOpen: boolean;
    interval?: number;
    onClose: () => void;
    onSchedule: (date: DateValue, time: Time) => void;
}

export interface TimeGridProps {
    slots: Time[];
    selectedTime: Time | undefined;
    onTimeClick: (time: Time) => void;
    formatTime: (time: Time) => string;
}