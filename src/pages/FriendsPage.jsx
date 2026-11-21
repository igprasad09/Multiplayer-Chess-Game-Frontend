import { useState } from "react";
import FriendsComponent from "../components/FriendsComponent";
import SideBar from "../components/SideBar";
import socket from "../services/socket";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { playingPlayersListAtom } from "../utils/store/ChessAtom";

function FriendsPage(){
    const [playingPlayerList, setPlayingPlayerList] = useAtom(playingPlayersListAtom);

    useEffect(()=>{
        const onPlayingPlayerList = (list) => {
            console.log(list);
            setPlayingPlayerList(new Set(list));
        }

        socket.on("playingPlayerList", onPlayingPlayerList);
        socket.emit("getPlayingPlayers"); // fetch current state on mount

        return ()=>{
            socket.off("playingPlayerList", onPlayingPlayerList);
        }
    },[setPlayingPlayerList]);

    useEffect(()=>{
       console.log(playingPlayerList);
    },[playingPlayerList]);
    
    return(
        <div className="bg-neutral-800 h-screen flex">
            <SideBar/>
            <FriendsComponent/>
        </div>
    )
}

export default FriendsPage;