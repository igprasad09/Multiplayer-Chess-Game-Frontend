import FriendsComponent from "../components/FriendsComponent";
import SideBar from "../components/SideBar";

function FriendsPage(){

    return(
        <div className="bg-neutral-800 h-screen flex">
            <SideBar/>
            <FriendsComponent/>
        </div>
    )
}

export default FriendsPage;