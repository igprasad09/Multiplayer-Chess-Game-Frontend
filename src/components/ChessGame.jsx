import {Chessboard, defaultPieces} from "react-chessboard";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { useAtom, useAtomValue } from "jotai";
import { fenAtom, gameColorAtom, opponentUsernameAtom, resultAtom, turnAtom, userNameAtom } from "../utils/store/ChessAtom";
import playSound from "../hooks/playSound";
import socket from "../services/socket";


function ChessGame(){
     const [fen, setFen] = useAtom(fenAtom);
      const [turn, setTurn] = useAtom(turnAtom);
      const [selectedSquare, setSelectedSquare] = useState("");
      const [legalMoves, setLegalMoves] = useState([]);
      const [isCheckmate, setIsCheckmate] = useState(false);
      const [result, setResult] = useAtom(resultAtom); 
      const [color, setColor] = useAtom(gameColorAtom);
      const [opponentUsername, setOpponentUsername] = useAtom(opponentUsernameAtom);
      const username = useAtomValue(userNameAtom);
      const [gameStatus, setGameStatus] = useState("waiting");
      const colorRef = useRef(color);
      useEffect(()=> { colorRef.current = color; }, [color]);

      const chess = useMemo(()=> new Chess(fen), [fen]);
      
      //all the socket connections
      useEffect(() => {
          const onWaiting = () => setGameStatus("waiting");

          const onMatched = ({ gameId, color, opponentUsername }) => {
            setColor(color);
            setOpponentUsername(opponentUsername);
            setGameStatus("playing");
          };

          const onOpponentLeft = () => setGameStatus("opponent-left");

          const onGameState = (data) => {
            setFen(data.fen);
            setTurn(data.turn);
            if (data.isGameOver) {
              setResult(
                data.winner ? (data.winner === colorRef.current ? "win" : "loss") : "draw"
              );
            } else {
              setResult(false);
            }
          };

          socket.on("waitingForOpponent", onWaiting);
          socket.on("matched", onMatched);
          socket.on("opponentLeft", onOpponentLeft);
          socket.on("gameState", onGameState);

          socket.emit("findMatch");

          return () => {
            socket.off("waitingForOpponent", onWaiting);
            socket.off("matched", onMatched);
            socket.off("opponentLeft", onOpponentLeft);
            socket.off("gameState", onGameState);
          };
        }, []);
      
      //on picecedrop send that move to the opponent using the sockets
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
                      if(data.check && !data.isCheckmate){
                          playSound("check");
                      }else if(data.captured){
                          playSound("capture")
                      }else {
                        playSound("move");
                }
            }else{
                console.log("Move rejected:", data.reason);
            }
        })
      }

      //show that legal moves where ever that pice can be place
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
      // client side check that is this move is legal
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
      // checked king square
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
      // after check kings squire animation
      const squareStyles = {
        ...legalMoves,
        ...(checkedKingSquare && {
          [checkedKingSquare]: { animation: "kingInCheck 1s ease-in-out infinite" },
        }),
      };

      // after check king shake
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
        boardOrientation: color === "black" ? "black" : "white",
        darkSquareStyle: { backgroundColor: "#769656" },
        lightSquareStyle: { backgroundColor: "#eeeed2" },
      }

    if (gameStatus === "waiting") {
      return <div className="text-white text-2xl">Waiting for opponent...</div>;
    }
    if (gameStatus === "opponent-left") {
      return <div className="text-white text-2xl">Opponent disconnected.</div>;
    }

    return (
        <div className="w-[min(37.5rem,calc(100vh-9rem))]">
           <div className="flex mb-3 mt-auto">
                <div className="bg-neutral-600 rounded-sm h-12 w-12 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-neutral-400 h-9 w-9">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8z"/>
                    </svg>
                </div>
                <p className="text-white font-semibold ml-5 flex items-start gap-2">
                    {opponentUsername}<img src="https://flagcdn.com/24x18/in.png" className="mt-1" alt="India" />
                </p>
            </div>
            <Chessboard options={chessboardOptions}/>
            <div className="flex mt-2">
                <div className="bg-neutral-300 rounded-sm h-12 w-12 flex items-center justify-center">
                    <img src="/public/images/username.svg" className=" rounded-sm" alt="" />
                </div>
                <p className="text-white font-semibold ml-5 flex items-start gap-2">
                    {username}<img src="https://flagcdn.com/24x18/in.png" className="mt-1" alt="India" />
                </p>
            </div>
        </div>
    )
}

export default ChessGame;