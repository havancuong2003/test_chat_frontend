import { Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Home from "./pages/home/home";
import Login from "./pages/login/login";
import SignUp from "./pages/signup/sign-up";
import { useAuthContext } from "./context/auth-context";

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          // element={authUser ? <Navigate to="/" /> : <Login />}
          element={<Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
