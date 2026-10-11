import {Chessboard, defaultPieces} from "react-chessboard";
import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { useAtom, useSetAtom } from "jotai";
import { fenAtom, resultAtom, turnAtom } from "../utils/store/ChessAtom";
import playSound from "../hooks/playSound";
import socket from "../services/socket";

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
          function handleGameState(data){
              setFen(data.fen);
              setTurn(data.trun);
              setResult(data.isGameOver);
          }
          socket.on("gameState", handleGameState);
          return () => socket.off("gameState", handleGameState);
      },[])

      function onPieceDrop({ sourceSquare, targetSquare }){
          socket.emit("gameMove",{
            from: sourceSquare, 
            to: targetSquare
          },
        (data)=>{
            if(data.valid){
               setFen(data.fen),
               setTurn(data.turn);
               setIsCheckmate(data.isCheckmate);
                if(data.isGameOver){
                    setResult("win");
                      }
                      if(data.check && !data.isCheckmate){
                          playSound("check");
                      }else if(data.captured){
                          playSound("capture")
                      }else {
                        playSound("move");
                }
            }
        })
      }

      useEffect(()=>{
         socket.on("connect", ()=>{
            console.log("My socket id:", socket.id);
         })
      },[]);

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