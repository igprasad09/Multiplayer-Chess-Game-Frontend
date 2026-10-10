import { Routes, Route } from "react-router-dom"
import GamePage from "../pages/GamePage.jsx"

function App() {

  return (
     <Routes>
           <Route path="/" element={<GamePage />} />
     </Routes>
  )
}

export default App
