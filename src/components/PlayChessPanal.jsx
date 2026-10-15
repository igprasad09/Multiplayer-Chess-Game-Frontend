function PlayChessPanal({ onPlayOnline }){
    return (<div className="h-screen flex flex-1 min-w-0 flex-col p-4 rounded-sm">
         <div className="flex bg-stone-900 items-center px-14 py-3 rounded-sm">
             <img className="size-15" src="/public/images/play-white.svg" alt="#" />
             <p className="text-4xl text-white font-bold">Play Chess</p>
         </div>
         <div className="bg-stone-700 flex-1 rounded-sm">
             {/* play online */}
             <button
                type="button"
                onClick={onPlayOnline}
                className="flex text-left bg-neutral-800 gap-2 p-5 m-5 rounded-2xl cursor-pointer hover:bg-stone-900 transition duration-200 ease-in-out"
             >
                <img src="/public/images/playgame.svg" alt="#" className="size-15" />
                <span className="">
                   <p className="text-3xl font-bold text-white">Play Online</p>
                   <p className="text-zinc-300">Play vs a person of similar skill</p>
                </span>
             </button>

            {/* play a friend */}
             <button
                type="button"
                className="flex text-left bg-neutral-800 gap-2 p-5 m-5 rounded-2xl cursor-pointer hover:bg-stone-900 transition duration-200 ease-in-out"
             >
                <img src="/public/images/hand-shake.svg" alt="#" className="size-15" />
                <span className="">
                   <p className="text-3xl font-bold text-white">Play With Friend</p>
                   <p className="text-zinc-300">Invite a Friend to a game of chess</p>
                </span>
             </button>

         </div>
    </div>)
}

export default PlayChessPanal