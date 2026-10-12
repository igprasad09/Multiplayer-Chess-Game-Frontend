
function SideBar(){
    
    return (<div className="h-screen bg-neutral-900 w-70">
          <div className="flex justify-center"><img className="h-13 mt-3" src="/public/images/chesslogo.png" alt="#" /></div>
          <span className="flex justify-center p-3 rounded-2xl m-5 cursor-pointer hover:bg-neutral-600 transition duration-200 ease-in-out bg-neutral-700 items-center gap-3 mt-7">
            <img className="h-10 -ml-15" src="/public/images/play-white.svg" alt="" />
            <h1 className="text-2xl text-white font-bold mt-2">Play</h1>
          </span>
    </div>)
}

export default SideBar;