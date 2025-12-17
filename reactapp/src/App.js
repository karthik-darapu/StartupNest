import React from "react";
import "./App.css";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthExpiredModal from "./Components/AuthExpiredModal";
import MentorNavbar from "./MentorComponents/MentorNavbar";
import EntrepreneurNavbar from "./EntrepreneurComponents/EntrepreneurNavbar";
import AppRoutes from "./routes/AppRoutes"; 

const AppLayout = ({ children }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && (
        <>
          {role === "Mentor" && <MentorNavbar />}
          {role === "Entrepreneur" && <EntrepreneurNavbar />}
        </>
      )}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <ToastContainer position="top-right" newestOnTop closeOnClick pauseOnHover />
        <AuthExpiredModal />
        <AppRoutes /> 
      </AppLayout>
    </Router>
  );
}

export default App;
