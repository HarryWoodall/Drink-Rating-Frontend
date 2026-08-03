import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { baseImageStore } from "./paths";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imagePath(imageId: string | null) {
  if (!imageId) {
    return undefined;
  }

  return `${baseImageStore()}/${imageId}`;
}
