import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { fenAtom, gameColorAtom, resultAtom, turnAtom } from "../utils/store/ChessAtom";
import axios from "axios";
import GameOver from "../components/GameOver";
import ChessGame from "../components/ChessGame";
import socket from "../services/socket";
import playSound from "../hooks/playSound";

function GamePage(){
    const [turn, setTurn] = useAtom(turnAtom);
    const setFen = useSetAtom(fenAtom);
    const [result, setResult] = useAtom(resultAtom);
    const color = useAtomValue(gameColorAtom);

    async function handleResetGame() {
              socket.emit("resetGame",(data)=>{
                  setFen(data.fen);
                  setTurn(data.turn);
                  setResult(false)
              });
              playSound("win", true);
           }

    return (
      <div className="flex justify-center bg-neutral-800 h-screen items-center transition duration-300 ease-in-out">
            <ChessGame/>
            {result && <GameOver
                result={result}
                handleResetGame={handleResetGame}/>
              }
              <div className="flex flex-col items-start gap-4 ml-10 text-white">
                <h1 className="text-4xl font-bold">Turn: {turn == "b" ? "Black" : "White"}</h1>
                <h2 className="text-2xl capitalize">Your Color is: {color}</h2>
                <button onClick={handleResetGame} className="bg-red-500 px-4 py-2 rounded-sm hover:bg-red-600 transition-colors">Reset</button>
            </div>
      </div>
    )
}

export default GamePage;
