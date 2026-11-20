import { useState } from "react";
import FriendsComponent from "../components/FriendsComponent";
import SideBar from "../components/SideBar";
import socket from "../services/socket";
import { useEffect } from "react";

function FriendsPage(){
    
    return(
        <div className="bg-neutral-800 h-screen flex">
            <SideBar/>
            <FriendsComponent/>
        </div>
    )
}

export default FriendsPage;