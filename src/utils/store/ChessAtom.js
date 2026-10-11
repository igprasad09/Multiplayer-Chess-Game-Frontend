import { atom } from "jotai";

export const turnAtom = atom("");
export const fenAtom = atom("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
export const resultAtom = atom("");
export const isGameOverAtom = atom(false);
export const gameColorAtom = atom(null);