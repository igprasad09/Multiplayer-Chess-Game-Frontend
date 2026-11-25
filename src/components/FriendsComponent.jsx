import { useEffect, useState, useSyncExternalStore } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAtom, useAtomValue } from "jotai";
import { userNameAtom } from "../utils/store/ChessAtom";
import { onlineUsersAtom, userIdAtom } from "../utils/store/authAtom";
import socket from "../services/socket";
import { Friends } from "./Friends";
import { allFriendsSetAtom, friendFilterAtom, friendsDataAtom } from "../utils/store/friendsAtom";
import { ENV } from "../config/env";

function FriendsComponent(){
    const [friendsFilter, setFriendsFilter] = useAtom(friendFilterAtom);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [totalUserCount, setTotalUserCount] = useState(0);
    const username = useAtomValue(userNameAtom);
    const userId = useAtomValue(userIdAtom);
    const [searchValue, setSearchValue] = useState("");
    const onlineUsersList = useAtomValue(onlineUsersAtom);
    const allFriends = useAtomValue(friendsDataAtom);
    const [friendsSet, setAllfriendsSet] = useAtom(allFriendsSetAtom); 

    useEffect(()=>{
        const newFriendSet = new Set(
            allFriends.friends.map((friend) => friend.userId)
        );
        setAllfriendsSet(newFriendSet);
    }, [allFriends.friends, setAllfriendsSet]);
    
    async function featchAllUsers() {
        try {
            const res = await axios.get(
                `${ENV.API_URL}/api/allusers`,
                {
                    params: { 
                        page,
                        username: searchValue.trim() || undefined
                     }
                }
            );

           if(page == 1){
              setUsers(res.data.users);
           }else{
              setUsers(prev => [...prev, ...res.data.users]);
           }

            setTotalUserCount(res.data.totalusers);
            console.log(res.data.users)
            return res.data;

        } catch (err) {
            throw err;
        }
    }

    function handleSendFriendRequiest(element){
        if(!userId) { toast.error("Login First") }
        console.log(username)

        socket.emit("sendFriendRequest", 
            { 
                senderId: userId, 
                friendId: element.id 
            }, 
            (response)=>{
               if(response.success){
                   toast.success(response.message);
               }else{
                   toast.error(response.message);
               }
           })

    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (friendsFilter === "allFriends") {
                featchAllUsers();
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [friendsFilter, page, searchValue]);

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
        setPage(1);
    };

    return (
        <div className=" flex-1 min-w-0">
           <div className="mt-10 flex justify-center">
             <input value={searchValue} onChange={handleSearch} className=" placeholder:text-white border-2 text-2xl text-white border-gray-400 rounded-sm px-40 py-2" type="text" placeholder="Search by username"/>
             <select
                value={friendsFilter}
                onChange={(e)=>setFriendsFilter(e.target.value)}
                className="text-white ml-3 bg-neutral-800 border-2 border-gray-400 rounded-sm px-2"
             >
                 <option value="myFriends">My Friends</option>
                 <option value="allFriends">All Users</option>
             </select>
           </div>
           <div className="text-white overflow-y-scroll h-140">
                 {friendsFilter == "myFriends" ? (
                    <div className="">
                        <Friends/>
                    </div>
                 ) : (
                    <div>
                        {users.map((element, index) => {
                            if (element.username !== username) {
                                return (
                                    <div
                                        key={element.id}
                                        className="flex items-center justify-between m-2 px-4 py-2 rounded-lg bg-gray-800 transition duration-300 ease-in-out hover:bg-gray-700"
                                        >
                                        <div className="flex items-center gap-3">
                                            <span
                                            className={`h-3 w-3 rounded-full ${
                                                onlineUsersList.has(element.id) ? "bg-green-500" : "bg-gray-500"
                                            }`}
                                            />
                                            <p className="text-2xl">{element.username}</p>
                                        </div>

                                        {friendsSet.has(element.id) ? 
                                        (<button
                                            className="bg-gray-600 px-4 py-1.5 rounded-md transition ease-in-out duration-200"
                                        >
                                           Already Friends
                                        </button>) : (<button
                                            onClick={() => handleSendFriendRequiest(element)}
                                            className="bg-green-600 px-4 py-1.5 rounded-md cursor-pointer hover:bg-green-800 transition ease-in-out duration-200"
                                        >
                                            Send Request
                                        </button>)}
                                        </div>
                                );
                            }

                            return null;
                        })}
                    </div>
                 ) }
           </div>
            {users.length < totalUserCount && (
                <button
                    onClick={() => setPage(prev => prev + 1)}
                    className="bg-red-500 text-2xl text-amber-50 px-7 rounded-sm cursor-pointer hover:bg-red-600"
                >
                    Load More
                </button>
            )}
        </div>
    )
}

export default FriendsComponent;