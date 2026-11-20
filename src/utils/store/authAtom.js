import { atom } from "jotai";

export const userIdAtom = atom(null);
export const onlineUsersAtom = atom(new Set());