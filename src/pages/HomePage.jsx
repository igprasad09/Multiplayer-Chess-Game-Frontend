import { useNavigate } from "react-router-dom";
import socket from "../services/socket";
import SideBar from "../components/SideBar";
import ChessBoardView from "../components/ChessBoardView";
import PlayChessPanal from "../components/PlayChessPanal";
import axios from "axios";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { reLoginAtom } from "../utils/store/ChessAtom";

function HomePage(){
    const navigate = useNavigate();
    const setRelogin = useSetAtom(reLoginAtom);

    function handleStartGame(){
        socket.connect();
        navigate("/game")
    }

    useEffect(()=>{
        async function authCheck() {
            await axios.post("http://localhost:3000/auth/login", 
                {},
                { withCredentials: true }).then((res)=>{
                        if(res.data.relogin){
                            setRelogin(res.data.relogin);
                        }
                }).catch((err)=>{
                     console.log(err);
                });
        }
        authCheck();
    },[])

    return (<div className="bg-neutral-800 h-screen flex">
          <SideBar />
          <ChessBoardView/>
          <PlayChessPanal />
    </div>)
}

export default HomePage;