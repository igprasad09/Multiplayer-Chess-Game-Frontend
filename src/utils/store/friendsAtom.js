import { atom } from "jotai";

export const friendsDataAtom = atom({
    friends: [],
    requests: [],
    rejected: []
});

export const refreshFriendsAtom = atom(0);
export const friendFilterAtom = atom("myFriends");