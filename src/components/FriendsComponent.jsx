import { useState } from "react";

function FriendsComponent(){
    const [friendsFilter, setFriendsFilter] = useState("myFriends");
    console.log(friendsFilter)
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
           <div className="">
                 
           </div>
        </div>
    )
}

export default FriendsComponent;