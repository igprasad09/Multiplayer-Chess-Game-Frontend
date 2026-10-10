import {Chessboard, defaultPieces} from "react-chessboard";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { useAtom, useSetAtom } from "jotai";
import { fenAtom, isGameOverAtom, resultAtom, turnAtom } from "../utils/ChessAtom";

function ChessGame(){
     const [fen, setFen] = useAtom(fenAtom);
      const [turn, setTurn] = useAtom(turnAtom);
      const [selectedSquare, setSelectedSquare] = useState("");
      const [legalMoves, setLegalMoves] = useState([]);
      const [isCheckmate, setIsCheckmate] = useState(false);
      const setResult = useSetAtom(resultAtom); 

      const chess = useMemo(()=> new Chess(fen), [fen]);

      const checkedKingSquare = useMemo(() => {
        if (!chess.inCheck()) return null;
        const sideInCheck = chess.turn();
        for (const row of chess.board()) {
          for (const sq of row) {
            if (sq && sq.type === "k" && sq.color === sideInCheck) {
              return sq.square;
            }
          }
        }
        return null;
      }, [chess]);

      useEffect(()=>{
           async function fetch() {
                await axios.get("http://localhost:3000/game").then((res)=>{
                    setFen(res.data.fen);
                    setTurn(res.data.turn);
                    setResult(res.data.isGameOver);
                })
           }
           fetch()
      },[])

      function playSound(soundName) {
      const audio = new Audio(`/sounds/${soundName}.mp3`);

      audio.play().catch((err) => {
        console.log("Sound playback failed:", err);
          });
        }

      function onPieceDrop({ sourceSquare, targetSquare }){
        axios.post("http://localhost:3000/move",{
          from: sourceSquare,
          to: targetSquare
        }).then((res)=>{
          if(res.data.valid){
            setFen(res.data.fen);
            setTurn(res.data.turn);
            setSelectedSquare("");
            setLegalMoves([]);
            setIsCheckmate(res.data.isCheckmate);
            if(res.data.isGameOver){
                setResult("win")
            }
            if (res.data.check && !res.data.isCheckmate) {
                playSound("check");
              } else if (res.data.captured) {
                playSound("capture");
              } else {
                playSound("move");
              }
          }
        }).catch((err)=>{
          console.log("Request failed: ", err);
        });

        return false;
      }

      function getMoveOptions(square){
          const moves = chess.moves({square, verbose: true});
          if(moves.length === 0){
              setLegalMoves([]);
              return;
          }
          const newSquareStyles = {};
          moves.forEach((move)=>{
               newSquareStyles[move.to] = {
                 background: move.captured
                    ? "radial-gradient(circle, rgba(0,0,0,.15) 85%, transparent 85%)"
                    : "radial-gradient(circle, rgba(0,0,0,.3) 25%, transparent 26%)",
                  borderRadius: "50%",
               };
          });
          setLegalMoves(newSquareStyles);
          setSelectedSquare(square);
      }

      function onSquareClick({square, piece}){
         if(selectedSquare && legalMoves[square]){
            onPieceDrop({sourceSquare: selectedSquare, targetSquare: square});
            setSelectedSquare("");
            setLegalMoves([]);
            return;
         }
         if(piece && piece.pieceType[0] === turn){
            getMoveOptions(square);
         }else{
            setSelectedSquare("");
            setLegalMoves([]);
         }
      }

      const squareStyles = {
        ...legalMoves,
        ...(checkedKingSquare && {
          [checkedKingSquare]: { animation: "kingInCheck 1s ease-in-out infinite" },
        }),
      };

      const pieces = useMemo(() => {
        return Object.fromEntries(
          Object.entries(defaultPieces).map(([pieceCode, renderPiece]) => [
            pieceCode,
            (props) => {
              const isCheckedKing =
                (pieceCode === "wK" || pieceCode === "bK") &&
                props?.square === checkedKingSquare;
              return (
                <div
                  style={
                    isCheckedKing
                      ? { width: "100%", height: "100%", animation: "kingShake 0.4s ease-in-out infinite" }
                      : { width: "100%", height: "100%" }
                  }
                >
                  {renderPiece(props)}
                </div>
              );
            },
          ])
        );
      }, [checkedKingSquare]);

      const chessboardOptions = {
        position: fen,
        onPieceDrop: onPieceDrop,
        onSquareClick: onSquareClick,
        squareStyles: squareStyles,
        pieces: pieces,
      }

    return (
        <div className="size-150">
            <Chessboard options={chessboardOptions}/>
        </div>
    )
}

export default ChessGame;