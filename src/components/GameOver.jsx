
function GameOver({ result, handleResetGame }) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        {result == "win" ? (<div className="bg-gray-900 w-90 rounded-2xl flex flex-col items-center gap-4">
            <img src="/images/victory.png" alt="#" className="size-24"/>
            <h1 className="text-2xl font-bold text-white text-center -mt-6">VICTORY</h1>
            <button onClick={handleResetGame} className="text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-500 hover:px-10 font-bold bg-red-600 rounded-2xl px-8 py-2 mb-4">Play Again</button>
        </div>):(<></>)}
        {result == "loss" ? (<div className="bg-gray-900 w-90 rounded-2xl flex flex-col items-center gap-4">
            <img src="/images/defeat.png" alt="#" className="size-22 ml-3 mt-2"/>
            <h1 className="text-2xl font-bold text-white text-center -mt-3">DEFEAT</h1>
            <button onClick={handleResetGame} className="text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-500 hover:px-10 font-bold bg-red-600 rounded-2xl px-8 py-2 mb-4 -mt-2">Play Again</button>
        </div>) : (<></>)}
        {result == "draw" ? (<div className="bg-gray-900 w-90 rounded-2xl flex flex-col items-center gap-4 py-6">
            <h1 className="text-2xl font-bold text-white text-center">DRAW</h1>
            <button onClick={handleResetGame} className="text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-500 hover:px-10 font-bold bg-red-600 rounded-2xl px-8 py-2">Play Again</button>
        </div>) : (<></>)}
    </div>
  );
}

export default GameOver;
