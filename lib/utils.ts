import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimecode(value: string) {
  if (value.startsWith("TC")) {
    return value;
  }

  return `TC ${value}`;
}
