import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { opponentUserIdAtom, opponentUsernameAtom, userNameAtom } from "../utils/store/ChessAtom";
import socket from "../services/socket";

export function LiveChatBox() {
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const username = useAtomValue(userNameAtom);
  const opponentUsername = useAtomValue(opponentUsernameAtom);
  const opponentUserId = useAtomValue(opponentUserIdAtom);

  const scrollRef = useRef(null);

  useEffect(()=>{
      if(scrollRef.current){
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  },[chats])

  function handleLiveChatMessage(){
      if(!text.trim()) return;
      if(!username) return;
      if(!opponentUsername) {alert("Wait For The Opponent"); return;}
      if(!opponentUserId) {alert("Wait For The Opponent"); return;}

      socket.emit("liveGameChatForOpponent", {
          text,
          opponentUserId,
          username
      });

      setChats((prev)=> [...prev, {
           username,
           message: text.trim()
      }]);
      setText("");
  }

  useEffect(()=>{
      const gotOpponentMsg = (data) => {
         setChats((prev)=> [...prev, {
            username: data.username,
            message: data.text
         }])
      }

      socket.on("liveGameChatMsgGot", gotOpponentMsg);
      return ()=>{
         socket.off("liveGameChatMsgGot", gotOpponentMsg);
      };
  },[setChats]);

  useEffect(()=>{
     console.log(chats);
  },[chats]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="text-white flex justify-center border-b-2 border-sky-500 bg-zinc-700 font-bold p-3 shrink-0">
        Live Chat
      </div>
      
      {/* show all the messages */}
      <div ref={scrollRef} className="bg- flex-1 min-h-0 w-full overflow-y-auto">

        <ul className="flex flex-col gap-3 p-3">
            {chats.map((msg, i) => {
                const isMe = msg.username === username;

                return (
                <li
                    key={i}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                    <span className="text-[11px] text-emerald-400 font-semibold mb-1">
                    {isMe ? "You" : msg.username}
                    </span>

                    <div
                    className={`text-sm px-3 py-2 rounded-lg max-w-[90%] break-words ${
                        isMe ? "bg-sky-700 text-white" : "bg-zinc-800 text-zinc-200"
                    }`}
                    >
                    {msg.message} ♟
                    </div>
                </li>
                );
            })}
            </ul>

      </div>
      <div className="p-3 bg-black flex">
        <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            onKeyDown={(e)=>{
                if(e.key =="Enter"){
                    handleLiveChatMessage()
                }
            }}
             placeholder="Enter Message"
            className="border-2 placeholder:text-neutral-500 border-sky-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none text-white px-3 py-1 rounded"
            />
         <button onClick={handleLiveChatMessage} className="text-white bg-green-600 py-1 px-4 ml-2 rounded-md hover:bg-green-800 cursor-pointer">Send</button>
      </div>
    </div>
  );
}