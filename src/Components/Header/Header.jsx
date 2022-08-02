import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

const Header = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const isLogin = Object.keys(auth).length > 0;
  
  const logout = () => {
    setAuth({});
    localStorage.removeItem('user');
  }
  return (
    <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
            <h1 className="navbar-brand">Retrospective Board</h1>
            {
                isLogin && (
                  <div className="">
                    <span className="ms-3 me-3 text-white">Hi {auth.user.username}!</span>
                    <button onClick={logout} className="ms-3 btn btn-danger">Logout</button>
                  </div>
                )
              }
        </div>
    </nav>
  )
}

export default Header;