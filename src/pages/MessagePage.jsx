import { useState, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import { friendsDataAtom } from "../utils/store/friendsAtom";
import { onlineUsersAtom, userIdAtom } from "../utils/store/authAtom";
import socket from "../services/socket";
import toast from "react-hot-toast";
import { refreshChatsAtom, unreadMessagesCountAtom } from "../utils/store/messageAtom";

export function MessagePage() {
  const allFriends = useAtomValue(friendsDataAtom);
  const myFriends = allFriends.friends;
  const onlineUsers = useAtomValue(onlineUsersAtom);
  const myUserId = useAtomValue(userIdAtom);
  const refreshChats = useAtomValue(refreshChatsAtom);
  const [unreadMsgCounts, setUnreadMsgCounts] = useAtom(unreadMessagesCountAtom);

  const navigate = useNavigate();
  const { userId } = useParams();

  const [tab, setTab] = useState("friends"); // "friends" or "unknown"
  const [unknownUsers, setUnknownUsers] = useState([]);

  // find the user from the url in friends first, then in unknown users
  const selectedFriend =
    myFriends.find((friend) => String(friend.userId) === userId) ||
    unknownUsers.find((user) => String(user.userId) === userId);

  const [text, setText] = useState("");
  const [composeText, setComposeText] = useState("");
  const [unknownUsername, setUnknownUsername] = useState("");
  const [chats, setChats] = useState([]);

  function handleSend() {
    if (text.trim() === "") return;
    setChats([...chats, { id: Date.now(), from: "me", text: text }]);

    socket.emit(
      "sendMessage",
      {
        receverId: parseInt(userId),
        senderId: myUserId,
        text,
      },
      (response) => {
        return;
      },
    );

    setText("");
  }

  function handleSendMessageAsUnknown() {
    if (composeText.trim() === "" || unknownUsername.trim() === "") return;

    socket.emit(
      "sendMessageToUnknown",
      {
        receverUsername: unknownUsername,
        senderId: myUserId,
        composeText,
      },
      (response) => {
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        setComposeText("");
        setUnknownUsername("");
      },
    );
  }

  // get chats of the selected user
  useEffect(() => {
    if (!userId) return;

    socket.emit(
      "allMessagesOfThisUser",
      { friendId: parseInt(userId), myId: myUserId },
      (response) => {
        if (response.success) {
          const formattedMessages = response.messages.map((msg) => ({
            id: msg.id,
            from: msg.senderId === Number(myUserId) ? "me" : "friend",
            text: msg.content,
            createdAt: msg.createdAt,
          }));

          setChats(formattedMessages);
        }
      },
    );
  }, [userId, myUserId, refreshChats]);

  // get users who are not my friends but have chatted with me
    useEffect(() => {
    socket.emit(
      "allUnknownUsers",
      { friendIds: myFriends.map((friend) => friend.userId) },
      (response) => {
        if (response.success) {
          setUnknownUsers(response.users);
        }
      },
    );
  }, [myUserId, refreshChats, myFriends.length]);

  // which list to show on the left side
  const listToShow = tab === "friends" ? myFriends : unknownUsers;

  function loadUnreadCounts(){
     socket.emit("unreadCounts", {}, (response)=>{
        if(response.success){
          setUnreadMsgCounts(response.counts);
        }
     });
  }

  useEffect(()=>{
    if(userId){
      socket.emit("markAsRead", { friendId: parseInt(userId) }, ()=>{
        loadUnreadCounts();
      });
    }else{
      loadUnreadCounts();
    }
  },[userId, refreshChats]);

  return (
    <div className="bg-neutral-800 flex h-screen">
      <SideBar />

      {/* left panel */}
      <div className="w-80 bg-neutral-900 m-2 rounded text-white">
        <div className="flex text-center text-sm">
          <div
            onClick={() => setTab("friends")}
            className={`flex-1 p-3 cursor-pointer ${tab === "friends" ? "border-b-2 border-green-500 font-bold" : ""}`}
          >
            Friends
          </div>
          <div
            onClick={() => setTab("unknown")}
            className={`flex-1 p-3 cursor-pointer ${tab === "unknown" ? "border-b-2 border-green-500 font-bold" : ""}`}
          >
            Unknown
            <span className="ml-2 bg-green-700 text-xs px-2 py-0.5 rounded-full">
              {unknownUsers.reduce((total, user) => total + (unreadMsgCounts[user.userId] || 0), 0)}
            </span>
          </div>
        </div>

        <div
          onClick={() => navigate("/messages")}
          className="p-3 border-b border-neutral-700 font-bold cursor-pointer"
        >
          New Message
        </div>

        {listToShow.length === 0 && (
          <div className="p-3 text-sm text-gray-400">No users here</div>
        )}

        {listToShow.map((friend) => (
            <div
              key={friend.userId}
              onClick={() => navigate(`/messages/${friend.userId}`)}
              className={`p-3 ${userId == friend.userId ? "bg-emerald-950" : ""} flex items-center gap-2 font-semibold border-b border-neutral-700 cursor-pointer hover:bg-gray-950`}
            >
              <div className="relative">
                <img
                  src="/images/username.svg"
                  alt="User avatar"
                  className="h-10 w-10 rounded"
                />
                {onlineUsers.has(friend.userId) && (
                  <span className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-neutral-900"></span>
                )}
              </div>
              {friend.username}
              <img
                src="https://flagcdn.com/24x18/in.png"
                className="size-4"
                alt="India"
              />

              {/* unread badge */}
              {unreadMsgCounts[friend.userId] > 0 && (
                <span className="ml-auto bg-green-600 text-xs px-2 py-0.5 rounded-full">
                  {unreadMsgCounts[friend.userId]}
                </span>
              )}
            </div>
          ))}
      </div>

      {/* right panel */}
      <div className="flex-1 bg-neutral-900 m-2 rounded text-white flex flex-col">
        {selectedFriend ? (
          <>
            {/* chat header */}
            <div className="p-4 border-b border-neutral-700 font-bold">
              {selectedFriend.username}
            </div>

            {/* chat messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={
                    chat.from === "me"
                      ? "bg-green-700 p-2 rounded self-end"
                      : "bg-neutral-700 p-2 rounded self-start"
                  }
                >
                  {chat.text}
                </div>
              ))}
            </div>

            {/* send box */}
            <div className="p-3 flex gap-2 border-t border-neutral-700">
              <input
                className="flex-1 bg-neutral-700 p-2 rounded"
                placeholder="Type a message"
                value={text}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                onClick={handleSend}
                className="bg-green-700 px-6 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <>
            {/* compose new message */}
            <div className="p-4 border-b border-neutral-700">
              Compose New Message
            </div>
            <div className="p-10">
              <div className="flex items-center mb-4">
                <span className="mr-3">To:</span>
                <input
                  className="flex-1 bg-neutral-700 p-2 rounded"
                  value={unknownUsername}
                  onChange={(e) => setUnknownUsername(e.target.value)}
                />
              </div>
              <textarea
                className="w-full h-60 bg-neutral-700 p-3 rounded"
                placeholder="Please be kind and respectful in your messages."
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
              />
              <button
                onClick={handleSendMessageAsUnknown}
                className="bg-green-700 px-10 py-2 rounded mt-4"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}