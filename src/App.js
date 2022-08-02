import './App.css';
import { Routes, Route } from "react-router-dom";
import RequireAuth from './Components/RequireAuth/RequireAuth';

//Views
import Login from './Views/Login/Login';
import Register from './Views/Register/Register';
import Main from './Views/Main/Main';
import Board from './Views/Board/Board';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireAuth />}>
        <Route path="/board/:code" element={<Board />} />
        <Route path="/" element={<Main />} />
      </Route>
    </Routes>
  );
}

export default App;
