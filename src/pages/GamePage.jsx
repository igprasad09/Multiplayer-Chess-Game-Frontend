import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  chessMovesAtom,
  fenAtom,
  gameColorAtom,
  resultAtom,
  turnAtom,
} from "../utils/store/ChessAtom";
import axios from "axios";
import GameOver from "../components/GameOver";
import ChessGame from "../components/ChessGame";
import socket from "../services/socket";
import playSound from "../hooks/playSound";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function GamePage() {
  const [turn, setTurn] = useAtom(turnAtom);
  const  setFen = useSetAtom(fenAtom);
  const [result, setResult] = useAtom(resultAtom);
  const color = useAtomValue(gameColorAtom);
  const gameMoves = useAtomValue(chessMovesAtom);
  const [gameMovesLength, setGameMovesLength] = useState(0);

  const movesRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(()=>{
     if(movesRef.current){
       movesRef.current.scrollTop = movesRef.current.scrollHeight;
     }
     setGameMovesLength(gameMoves.length);
  },[gameMoves])

  async function handleResetGame() {
    socket.emit("resetGame", (data) => {
      setFen(data.fen);
      setTurn(data.turn);
      setResult(false);
    });
    playSound("win", true);
  }

  function showPriviceFen(){
     clearInterval(intervalRef.current);
     intervalRef.current = null;
     if(gameMovesLength-1 == 0) return ;
     setGameMovesLength((prev)=> prev - 1);
     setFen(gameMoves[gameMovesLength-1].before);
     playSound("move");
  }

  function showForwordGame(){
     clearInterval(intervalRef.current);
     intervalRef.current = null;
     if(gameMovesLength === gameMoves.length) return;
     setGameMovesLength((prev)=> prev + 1);
     console.log(gameMoves[gameMovesLength-1]);
     setFen(gameMoves[gameMovesLength].after);
     playSound("move");
  }

  function playGameMoves() {
      // If interval is already running, stop it
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }

      let count = gameMovesLength;
      if(gameMovesLength == gameMoves.length){
         count = 0;
      }

      intervalRef.current = setInterval(() => {
        count++;

        if (count > gameMoves.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return;
        }

        setGameMovesLength(count);
        setFen(gameMoves[count - 1].after);
        playSound("move");

        if (count >= gameMoves.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 1000);
    }
    //clean up the interval when the component unmounts:
    useEffect(() => {
      return () => clearInterval(intervalRef.current);
    }, []);

  return (
    <div className="flex justify-center bg-neutral-800 h-screen items-center transition duration-300 ease-in-out">
      {result && <GameOver result={result} handleResetGame={handleResetGame} />}
      <div className="flex flex-col items-start gap-4 mr-6 text-white">
        <h1 className="text-3xl font-bold">
          Turn: {turn == "b" ? "Black" : "White"}
        </h1>
        <h2 className="text-xl capitalize">Your Color is: {color}</h2>
        <button
          onClick={handleResetGame}
          className="bg-red-500 px-4 py-2 rounded-sm hover:bg-red-600 transition-colors"
        >
          Reset
        </button>
      </div>
      <ChessGame />
      <div className="bg-mauve-900 h-150 w-80 mr-4 ml-4">

      </div>
      <div className="bg-zinc-900 h-150 w-80 flex flex-col">
        <div className="text-white flex justify-center border-b-2 border-sky-500 bg-zinc-700 font-bold p-3">
          Moves
        </div>

        <div ref={movesRef} className="flex-1 overflow-y-auto">
              {Array.from({ length: Math.ceil(gameMoves.length / 2) }, (_, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-[35px_1fr_1fr] px-3 py-1 text-white ${
                      i % 2 === 1 ? "bg-zinc-800" : ""
                    }`}
                  >
                    <span className="text-zinc-500 font-bold">{i + 1}.</span>
                    <span className={`font-bold ${i*2 === gameMovesLength-1 ? "bg-stone-700":""}`}>{gameMoves[i * 2]?.san}</span>
                    <span className={`font-bold ${i*2+1 === gameMovesLength-1 ? "bg-stone-700": ""}`}>{gameMoves[i * 2 + 1]?.san || ""}</span>
                  </div>
                ))}
        </div>
      <div className="bg-black flex justify-center gap-2 p-2">
          <button onClick={()=>showPriviceFen()}
            aria-label="Back"
            className="w-12 h-11 flex items-center justify-center rounded-md bg-neutral-800 text-white text-4xl leading-none pb-1 hover:bg-neutral-700 active:scale-95 transition"
          >
            ‹
          </button>
          <button
            onClick={playGameMoves}
            aria-label="Play"
            className="w-12 h-11 flex items-center justify-center rounded-md bg-neutral-800 text-white text-xl hover:bg-neutral-700 active:scale-95 transition"
          >
            ▶
          </button>
          <button onClick={showForwordGame}
            aria-label="Back"
            className="w-12 h-11 flex items-center justify-center rounded-md bg-neutral-800 text-white text-4xl leading-none pb-1 hover:bg-neutral-700 active:scale-95 transition"
          >
           ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
