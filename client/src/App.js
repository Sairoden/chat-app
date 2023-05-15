import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Chat from "./pages/Chat";
import Lobby from "./pages/Lobby";

function App() {
  return (
    <Routes>
      <Route index element={<Lobby />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
