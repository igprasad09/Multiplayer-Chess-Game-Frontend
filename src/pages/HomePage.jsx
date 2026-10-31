import { useNavigate } from "react-router-dom";
import socket from "../services/socket";
import SideBar from "../components/SideBar";
import ChessBoardView from "../components/ChessBoardView";
import PlayChessPanal from "../components/PlayChessPanal";
import axios from "axios";
import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { reLoginAtom, tokenAtom, userNameAtom } from "../utils/store/ChessAtom";
import toast, { Toaster } from "react-hot-toast";

function HomePage(){
    const navigate = useNavigate();
    const setRelogin = useSetAtom(reLoginAtom);
    const setUsername = useSetAtom(userNameAtom);
    const [token, setToken] = useAtom(tokenAtom);

    function handleStartGame(){
        if(!token) {return toast('Login is Required!', {
            icon: '👏',
            });}
        socket.auth = { token };
        socket.connect();
        navigate("/game")
    }


    return (<div className="bg-neutral-800 h-screen flex">
          <Toaster/>
          <SideBar />
          <ChessBoardView/>
          <PlayChessPanal onPlayOnline={handleStartGame} />
    </div>)
}

export default HomePage;