import { Time } from "@internationalized/date"

export const BACKEND_URL = import.meta.env.VITE_API_URL;
export const CHAT_LIMIT = Number(import.meta.env.VITE_CHAT_LIMIT);
export const MESSAGES_LIMIT = Number(import.meta.env.VITE_MESSAGES_LIMIT);
export const WS_URL = import.meta.env.VITE_WS_URL

export const DATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
} satisfies Intl.DateTimeFormatOptions;

export const encodeToBase64 = (data: any) => {
    return btoa(data);
};

export const decodeFromBase64 = (encodedData: any) => {
    return atob(encodedData);
};

export const convertBase64ToFile = (base64String: string, fileName: string) => {
    const parts = base64String.split(';base64,');
    if (parts.length < 2) {
        throw new Error("Invalid Base64 string");
    }
    const mimeType = parts[0].split(':')[1];
    const byteString = atob(parts[1]);

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });
    return new File([blob], fileName, { type: mimeType });
};

export const formatDate = (date: Date, withDate: Boolean = true, withTime: Boolean = false, withSeconds: Boolean = false) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const i = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    if(withDate && withTime){
        if(withSeconds){
            return `${y}-${m}-${d} ${h}:${i}:${s}`;
        }

        return `${y}-${m}-${d} ${h}:${i}`;
    }
    
    if(withDate && !withTime){
        return `${y}-${m}-${d}`;
    }
    
    if(!withDate && withTime){
        if(withSeconds){
            return `${h}:${i}:${s}`;
        }

        return `${h}:${i}`;
    }

    return `${y}-${m}-${d} ${h}:${i}:${s}`;
};

export const formatSchedule = (dateString?: string) => {
    if (!dateString) return ""

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(dateString))
}

export const generateTimeSlots = (
    intervalMinutes: number = 30
): Time[] => {
    const slots: Time[] = [];
    
    const minutesInDay = 1440; 

    for (let current = 0; current < minutesInDay; current += intervalMinutes) {
        const hour = Math.floor(current / 60);
        const minute = current % 60;
        slots.push(new Time(hour, minute));
    }

    return slots;
};


export const formatTime = (time: Time) => `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`

export const formatWeekday = (date: Date) => date.toLocaleDateString("en-US", { weekday: "long" })

export const formatMonthDay = (date: Date) => date.toLocaleDateString("en-US", { month: "long", day: "numeric" })