import { useAtomValue } from "jotai";
import { Chessboard } from "react-chessboard";
import { userNameAtom } from "../utils/store/ChessAtom";

function ChessBoardView(){
    const userName = useAtomValue(userNameAtom);
    const chessboardOptions = {
        darkSquareStyle: { backgroundColor: "#769656" },
        lightSquareStyle: { backgroundColor: "#eeeed2" }
    }
    return (
        <div className="grid ml-4">
             <div className="flex mb-3 mt-auto">
                <div className="bg-neutral-600 rounded-sm h-12 w-12 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-neutral-400 h-9 w-9">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8z"/>
                    </svg>
                </div>
                <p className="text-white font-semibold ml-5 flex items-start gap-2">
                    Opponent<img src="https://flagcdn.com/24x18/in.png" className="mt-1" alt="India" />
                </p>
            </div>
             <div className="size-140">
                 <Chessboard options={chessboardOptions}/>
             </div>
              <div className="flex mt-2">
                <div className="bg-neutral-300 rounded-sm h-12 w-12 flex items-center justify-center">
                    <img src="/public/images/username.svg" className=" rounded-sm" alt="" />
                </div>
                <p className="text-white font-semibold ml-5 flex items-start gap-2">
                    {userName}<img src="https://flagcdn.com/24x18/in.png" className="mt-1" alt="India" />
                </p>
            </div>
        </div>
    )
}

export default ChessBoardView;