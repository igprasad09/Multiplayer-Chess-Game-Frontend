import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { userNameAtom } from "../utils/store/ChessAtom";

function FriendsComponent(){
    const [friendsFilter, setFriendsFilter] = useState("myFriends");
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [totalUserCount, setTotalUserCount] = useState(0);
    const username = useAtomValue(userNameAtom);
    
    async function featchAllUsers() {
        try {
            const res = await axios.get(
                "http://localhost:3000/api/allusers",
                {
                    params: { page }
                }
            );

            setUsers((prev)=> [...prev, ...res.data.users]);
            setTotalUserCount(res.data.totalusers);
            console.log(res.data.users)
            return res.data;

        } catch (err) {
            throw err;
        }
    }

    function handleSendFriendRequiest(element){
         console.log(element)
    }

    useEffect(()=>{
        async function feathusers() {
            if(friendsFilter == "allFriends"){
                await toast.promise(featchAllUsers(), {
                    loading: "Feating Users",
                    success: (data)=> data.message
                })
            }
        }
        feathusers();
    },[friendsFilter, page]);

    return (
        <div className=" flex-1 min-w-0">
           <div className="mt-10 flex justify-center">
             <input className=" placeholder:text-white border-2 text-2xl text-white border-gray-400 rounded-sm px-40 py-2" type="text" placeholder="Search by username"/>
             <select
                value={friendsFilter}
                onChange={(e)=>setFriendsFilter(e.target.value)}
                className="text-white ml-3 bg-neutral-800 border-2 border-gray-400 rounded-sm px-2"
             >
                 <option value="myFriends">My Friends</option>
                 <option value="allFriends">All Friends</option>
             </select>
           </div>
           <div className="text-white overflow-y-scroll h-140">
                 {friendsFilter == "myFriends" ? (
                    <div className="">
                        {friends.length == 0 && (<p>No Friends</p>)}
                    </div>
                 ) : (
                    <div>
                        {users.map((element, index) => {
                            if (element.username !== username) {
                                return (
                                    <div key={element.id} className="flex transition duration-300 ease-in-out bg-gray-800 py-1 justify-between m-2">
                                        <p className="text-2xl ml-20">{element.username}</p>

                                        <button onClick={()=> handleSendFriendRequiest(element)} className="bg-green-600 px-4 cursor-pointer hover:bg-green-800 transition ease-in-out duration-200">
                                            Send Request
                                        </button>
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </div>
                 ) }
           </div>
           {users.length == totalUserCount && users.length != 0 ? (
                <button onClick={()=> toast("No Users")} className="bg-gray-500 text-2xl text-amber-50 px-7 rounded-sm cursor-pointer">Load More</button>
           ) : (
            <button onClick={()=> setPage((prev)=>prev+1) } className="bg-red-500 text-2xl text-amber-50 px-7 rounded-sm cursor-pointer hover:bg-red-600">Load More</button>
           )}
        </div>
    )
}

export default FriendsComponent;