import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenName(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0][0];
  } else if (words.length === 2) {
    return words.map(word => word[0]).join('');
  } else if (words.length >= 3) {
    return words[0][0] + words[words.length - 1][0];
  }

  return name;
}
