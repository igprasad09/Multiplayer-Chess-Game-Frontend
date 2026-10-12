import { useNavigate } from "react-router-dom";
import socket from "../services/socket";
import SideBar from "../components/SideBar";
import ChessBoardView from "../components/ChessBoardView";
import PlayChessPanal from "../components/PlayChessPanal";

function HomePage(){
    const navigate = useNavigate();
    function handleStartGame(){
        socket.connect();
        navigate("/game")
    }
    return (<div className="bg-neutral-800 h-screen flex">
          <SideBar />
          <ChessBoardView/>
          <PlayChessPanal />
    </div>)
}

export default HomePage;