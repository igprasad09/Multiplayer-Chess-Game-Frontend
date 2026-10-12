import { useNavigate } from "react-router-dom";

function SideBar(){
    const navigate = useNavigate();
    return (<div className="h-screen bg-neutral-900 w-90 flex flex-col justify-between">

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

            <div className="mx-4 mt-6 grid gap-3">
                <button onClick={()=>{navigate("/signup")}} className="bg-[#88c749] hover:bg-[#749c46] w-40 text-[18px] transition duration-200 ease-in-out text-white font-bold py-2 rounded-sm cursor-pointer">Sign Up</button>
                <button onClick={()=>{ navigate("/login") }} className="bg-neutral-700 w-40 hover:bg-neutral-600 transition duration-200 ease-in-out text-white font-bold py-2 rounded-sm cursor-pointer">Log In</button>
            </div>
        </div>

    </div>)
}

export default SideBar;