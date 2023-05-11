import "./App.css";
import { Routes, Route } from "react-router-dom";

import Chat from "./pages/Chat";
import Lobby from "./pages/Lobby";

function App() {
  return (
    <Routes>
      <Route index element={<Lobby />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
