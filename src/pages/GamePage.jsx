import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { fenAtom, gameColorAtom, resultAtom, turnAtom } from "../utils/store/ChessAtom";
import axios from "axios";
import GameOver from "../components/GameOver";
import ChessGame from "../components/ChessGame";
import socket from "../services/socket";

function GamePage(){
    const [turn, setTurn] = useAtom(turnAtom);
    const setFen = useSetAtom(fenAtom);
    const [result, setResult] = useAtom(resultAtom);
    const color = useAtomValue(gameColorAtom);

    async function handleResetGame() {
              socket.emit("resetGame",(data)=>{
                  console.log("Reset: ", data)
                  setFen(data.fen);
                  console.log(data.fen)
                  setTurn(data.turn);
                  setResult(false)
              });
           }

    return (
      <div className="grid justify-center bg-neutral-800 h-screen items-center transition duration-300 ease-in-out">
            <div className="flex">
              <h1 className="text-4xl font-bold m-auto text-white">Turn: {turn == "b" ? "Black" : "White"}</h1>
              <button onClick={handleResetGame} className="bg-red-500 px-3 hover:bg-red-600">Reset</button>
              <h1 className="text-2xl text-white">Yours Color is: {color}</h1>
            </div>
            <ChessGame/>
            {result && <GameOver
                result={result}
                handleResetGame={handleResetGame}/>
              }
      </div>
    )
}

export default GamePage;
