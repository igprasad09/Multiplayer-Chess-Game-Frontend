import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { friendsDataAtom, refreshFriendsAtom } from "../utils/store/friendsAtom";
import { onlineUsersAtom } from "../utils/store/authAtom";
import socket from "../services/socket";
import toast from "react-hot-toast";

export function Friends() {
  const [active, setActive] = useState("Friends");
  const onlineUsers = useAtomValue(onlineUsersAtom);
  const friendsData = useAtomValue(friendsDataAtom);
  const setRefreshFriends = useSetAtom(refreshFriendsAtom);

  const friends = friendsData?.friends || [];
  const requests = friendsData?.requests || [];

  const users = active === "Friends" ? friends : requests;

  function handleAcceptFriendRequest(userId) {
      socket.emit("acceptFriendRequest", { userId }, (response)=>{
          if(response.success){
            toast.success(response.message);
            setRefreshFriends((prev)=> prev + 1);
          }else{
            toast.error(response.message);
          }
      });
  }

  function handleRejectFriendRequest(userId) {
    socket.emit("rejectFriendRequest", {userId}, (response)=>{
        if(response.success){
          toast.success(response.message);
          setRefreshFriends((prev)=> prev + 1);
        }else{
          toast.error(response.message);
        }
    });
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mt-4 flex bg-gray-900 text-white">
        {["Friends", "Requests"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex-1 border-b-4 py-3 text-xl font-bold ${active === tab
              ? "border-blue-500 text-white"
              : "border-transparent text-gray-400"
              }`}
          >
            {tab} ({tab === "Friends" ? friends.length : requests.length})
          </button>
        ))}
      </div>

      {/* Users list */}
      <div className="p-4">
        {users.length === 0 ? (
          <p className="text-gray-400">
            {active === "Friends" ? "No friends yet" : "No requests"}
          </p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-3 rounded bg-gray-800 p-3 text-white"
              >
                {/* Avatar + online status */}
                <div className="relative flex h-10 w-10 shrink-0">
                  <img
                    src="/images/username.svg"
                    alt="User avatar"
                    className="h-10 w-10 rounded-full"
                  />

                  {onlineUsers.has(user.userId) && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-gray-800 bg-green-500"></span>
                  )}
                </div>

                {/* Username */}
                <span className="flex-1 font-bold text-xl">
                  {user.username || user.name}
                </span>

                {/* Accept and Reject buttons */}
                {active === "Requests" && (
                  <div className="flex gap-2">

                    {/* Reject */}
                    <button onClick={() => handleRejectFriendRequest(user.userId)} className="rounded bg-red-600 px-3 py-1 font-bold hover:bg-red-700">
                      ✕
                    </button>

                    {/* Accept */}
                    <button onClick={() => handleAcceptFriendRequest(user.userId)} className="rounded bg-green-600 px-3 py-1 font-bold hover:bg-green-700">
                      ✓
                    </button>
                  </div>
                )}

                {active === "Friends" && (
                  <div className="flex gap-2">

                      {/* message */}
                     <button
                        className="flex cursor-pointer items-center justify-center rounded px-3 py-1 font-bold hover:bg-gray-700 transition"
                        aria-label="Message"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 3C6.477 3 2 6.582 2 11c0 2.16 1.07 4.1 2.8 5.46L4 21l4.2-1.4A12.3 12.3 0 0 0 12 20c5.523 0 10-3.582 10-8s-4.477-9-10-9Zm-4 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
                        </svg>
                      </button>

                      {/* challenge */}
                      <button className="rounded bg-green-600 px-3 py-1 font-bold hover:bg-green-700">
                        Challenge
                      </button>
                    </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}