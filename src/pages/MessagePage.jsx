import { useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import { friendsDataAtom } from "../utils/store/friendsAtom";
import { onlineUsersAtom, userIdAtom } from "../utils/store/authAtom";
import socket from "../services/socket";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { refreshChatsAtom } from "../utils/store/messageAtom";

export function MessagePage() {
  const allFriends = useAtomValue(friendsDataAtom);
  const myFriends = allFriends.friends;
  const onlineUsers = useAtomValue(onlineUsersAtom);
  const myUserId = useAtomValue(userIdAtom);
  const refreshChats = useAtomValue(refreshChatsAtom);

  const navigate = useNavigate();

  // access the id from the url like this:
  // url is /messages/123, so userId will be "123"
  const { userId } = useParams();

  // find the friend whose id matches the url
  const selectedFriend = myFriends.find(
    (friend) => String(friend.userId) === userId,
  );

  const [text, setText] = useState("");

  // dummy chats for now, later get these from your backend
  const [chats, setChats] = useState([]);

  function handleSend() {
    if (text.trim() === "") return;
    setChats([...chats, { id: Date.now(), from: "me", text: text }]);

    console.log({ receverId: parseInt(userId), senderId: myUserId, text });

    socket.emit(
      "sendMessage",
      {
        receverId: parseInt(userId),
        senderId: myUserId,
        text,
      },
      (response) => {
        if (response.success) {
          toast(`${response.message}`, { duration: 4000 });
        } else {
          toast.error(response.message);
        }
      },
    );

    setText("");
  }

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

    return () => {};
  }, [userId, myUserId, refreshChats]);

  return (
    <div className="bg-neutral-800 flex h-screen">
      <SideBar />

      {/* left panel */}
      <div className="w-80 bg-neutral-900 m-2 rounded text-white">
        <div className="flex text-center text-sm">
          <div className="flex-1 p-3">Friends</div>
          <div className="flex-1 p-3">Unknown</div>
        </div>

        <div
          onClick={() => navigate("/messages")}
          className="p-3 border-b border-neutral-700 font-bold cursor-pointer"
        >
          New Message
        </div>

        {myFriends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => navigate(`/messages/${friend.userId}`)}
            className="p-3 flex items-center gap-2 font-semibold border-b border-neutral-700 cursor-pointer hover:bg-neutral-800"
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
                  defaultValue="igprasad"
                />
              </div>
              <textarea
                className="w-full h-60 bg-neutral-700 p-3 rounded"
                placeholder="Please be kind and respectful in your messages."
              />
              <button className="bg-green-700 px-10 py-2 rounded mt-4">
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
