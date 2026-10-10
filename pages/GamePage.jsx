import ChessGame from "../components/ChessGame";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { fenAtom, resultAtom, turnAtom } from "../utils/ChessAtom";
import axios from "axios";
import GameOver from "../components/GameOver";

function GamePage(){
    const [turn, setTurn] = useAtom(turnAtom);
    const setFen = useSetAtom(fenAtom);
    const [result, setResult] = useAtom(resultAtom);

    async function handleResetGame() {
              await axios.post("http://localhost:3000/resetgame").then((res)=>{
                  console.log("Reset: ", res.data)
                  setFen(res.data.fen);
                  setTurn(res.data.turn);
                  setResult(false)
              })
           }

    return (
      <div className="grid justify-center bg-neutral-800 h-screen items-center transition duration-300 ease-in-out">
            <div className="flex">
              <h1 className="text-4xl font-bold m-auto text-white">Turn: {turn == "b" ? "Black" : "White"}</h1>
              <button onClick={handleResetGame} className="bg-red-500 px-3 hover:bg-red-600">Reset</button>
            </div>
            <ChessGame/>
            {result && <GameOver 
                result={result?"win":"loss"} 
                handleResetGame={handleResetGame}/>
              }
      </div>
    )
}

export default GamePage;
