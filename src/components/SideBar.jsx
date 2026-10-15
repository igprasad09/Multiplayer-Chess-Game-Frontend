import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { reLoginAtom, tokenAtom, userNameAtom } from "../utils/store/ChessAtom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v13A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-13Zm2.2.5 6.8 5.1 6.8-5.1H5.2ZM19 7.3l-6.7 5a1 1 0 0 1-1.2 0L4.4 7.3V18h14.6V7.3Z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2a6 6 0 0 0-6 6v3.1c0 .6-.2 1.2-.6 1.7L4 15.3c-.8 1-.1 2.5 1.2 2.5h13.6c1.3 0 2-1.5 1.2-2.5l-1.4-2.5a2.8 2.8 0 0 1-.6-1.7V8a6 6 0 0 0-6-6Zm0 19.5a2.5 2.5 0 0 0 2.4-1.8H9.6A2.5 2.5 0 0 0 12 21.5Z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.61l-1.92-3.32a.5.5 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.5.5 0 0 0-.48-.41h-3.84a.5.5 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.59.22L2.74 8.87a.5.5 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.24.23.41.47.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.03-1.58ZM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M15.75 3a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V4.5H6v15h9v-3.75a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-10.5a.75.75 0 0 1-.75-.75V3.75A.75.75 0 0 1 5.25 3h10.5Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M21.5 12a.75.75 0 0 0-.75-.75H11a.75.75 0 0 0 0 1.5h9.08l-2.3 2.3a.75.75 0 1 0 1.06 1.06l3.58-3.58a.75.75 0 0 0 .08-.1l.02-.02a.75.75 0 0 0 0-.84.8.8 0 0 0-.1-.12l-3.58-3.58a.75.75 0 1 0-1.06 1.06l2.3 2.3H11l9.75.02A.75.75 0 0 0 21.5 12Z" clipRule="evenodd" />
    </svg>
);

function SideBar(){
    const navigate = useNavigate();
    const relogin = useAtomValue(reLoginAtom);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const setRelogin = useSetAtom(reLoginAtom);
    const username = useAtomValue(userNameAtom);
    const setToken = useSetAtom(tokenAtom);

    async function handleLogout(){
        try{
            await toast.promise(
                axios.post("http://localhost:3000/auth/logout",{},{withCredentials: true})
                .then((res)=>{
                    setRelogin(res.data.relogin);
                    setToken(null);
                }),
                {
                    loading: "Logging out.....",
                    success:  <b>Logout successful!</b>,
                    error: <b>Logout failed. Please try again.</b>
                }
            )
        }catch(err){
            console.log(err)
        }
    }

    return (<div className="h-screen bg-neutral-900 w-90 flex flex-col justify-between">
         <Toaster/>
         <div className="">
             <div className="flex justify-center"><img className="h-13 mt-3" src="/public/images/chesslogo.png" alt="#" /></div>
            {/* play */}
            <span className="flex justify-center p-2 rounded-2xl m-5 cursor-pointer hover:bg-neutral-600 transition duration-200 ease-in-out bg-neutral-700 items-center gap-3 mt-7">
              <img className="h-10 -ml-15" src="/public/images/play-white.svg" alt="" />
              <h1 className="text-2xl text-white font-bold mt-2">Play</h1>
            </span>
            
            {/* Friends */}
            <span className="flex justify-center p-2 rounded-2xl m-5 cursor-pointer hover:bg-neutral-600 transition duration-200 ease-in-out bg-neutral-700 items-center gap-3 mt-7">
              <img className="h-10 -ml-15" src="/public/images/friends.svg" alt="" />
              <h1 className="text-2xl text-white font-bold mt-2">Friends</h1>
            </span>
         </div>

        <div className="mb-8">
            {/* <div className="text-white relative mx-5">
                <svg className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input className="w-full pl-9 bg-gray-800 p-2 rounded-sm placeholder:text-neutral-300 font-bold outline-none" type="text" placeholder="Search Your Friends"/>
            </div> */}

            {relogin ? (
                <div className="mx-4 mt-6 grid gap-3">
                    <button onClick={()=>{navigate("/signup")}} className="bg-[#88c749] hover:bg-[#749c46] w-40 text-[18px] transition duration-200 ease-in-out text-white font-bold py-2 rounded-sm cursor-pointer">Sign Up</button>
                    <button onClick={()=>{ navigate("/login") }} className="bg-neutral-700 w-40 hover:bg-neutral-600 transition duration-200 ease-in-out text-white font-bold py-2 rounded-sm cursor-pointer">Log In</button>
                </div>
            ) : (
                <div className="mx-4 mt-6 relative">
                    <div className="flex items-center justify-center gap-2 mb-4 text-white">
                      <img src="/public/images/username.svg" className=" rounded-sm size-8" alt="" />
                        <h1 className="font-bold text-base">{username}</h1>
                    </div>

                    <div className="flex items-center justify-evenly px-1 text-neutral-300">
                        <button className="hover:text-white cursor-pointer transition duration-200 ease-in-out">
                            <MailIcon />
                        </button>
                        <button className="hover:text-white cursor-pointer transition duration-200 ease-in-out">
                            <BellIcon />
                        </button>
                        <button
                            onClick={()=>setShowSettingsMenu((prev)=>!prev)}
                            className="hover:text-white cursor-pointer transition duration-200 ease-in-out"
                        >
                            <SettingsIcon />
                        </button>
                    </div>

                    {showSettingsMenu && (
                        <div className="absolute bottom-12 right-0 bg-neutral-800 rounded-md shadow-lg overflow-hidden w-36 border border-neutral-700">
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-neutral-700 w-full text-left cursor-pointer transition duration-200 ease-in-out">
                                <LogoutIcon />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>

    </div>)
}

export default SideBar;