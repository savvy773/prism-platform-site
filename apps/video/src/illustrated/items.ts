import { type IconName, iconNames } from "./Icon";

export type Item = { icon?: IconName; label: string };

/** "icon:label" → { icon, label }; anything else is a plain label. */
export const parseItem = (raw: string): Item => {
  const match = /^([a-z]+):(.*)$/.exec(raw);
  if (match && (iconNames as readonly string[]).includes(match[1])) {
    return { icon: match[1] as IconName, label: match[2].trim() };
  }
  return { label: raw };
};
