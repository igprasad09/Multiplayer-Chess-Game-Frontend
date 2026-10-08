import {Chessboard} from "react-chessboard";
import axios from "axios";
import { useEffect, useState } from "react";
function App() {
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [turn, setTurn] = useState("");

  useEffect(()=>{
       async function fetch() {
            await axios.get("http://localhost:3000/game").then((res)=>{
                setFen(res.data.fen);
                setTurn(res.data.turn);
                console.log(res.data)
            })
       }
       fetch()
  },[])
  
  function onPieceDrop({ sourceSquare, targetSquare }){
    axios.post("http://localhost:3000/move",{
      from: sourceSquare,
      to: targetSquare
    }).then((res)=>{
      if(res.data.valid){
        setFen(res.data.fen);
        setTurn(res.data.turn);
        console.log(res.data)
      }
    }).catch((err)=>{
      console.log("Request failed: ", err);
    });

    return false;
  }

  const chessboardOptions = {
    position: fen,
    onPieceDrop: onPieceDrop,
  }

  async function handleResetGame() {
      await axios.post("http://localhost:3000/resetgame").then((res)=>{
          console.log("Reset: ", res.data)
          setFen(res.data.fen);
          setTurn(res.data.turn);
      })
  }

  return (
    <div className="grid justify-center h-screen items-center">
       <div className="flex">
         <h1 className="text-4xl font-bold m-auto">Turn: {turn == "b" ? "Black" : "White"}</h1>
         <button onClick={handleResetGame} className="bg-red-500 px-3 hover:bg-red-600">Reset</button>
       </div>
       <div className="size-150">
            <Chessboard options={chessboardOptions}/>
       </div>
    </div>
  )
}

export default App
