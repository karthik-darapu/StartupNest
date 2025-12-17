import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";
import Home from "../Components/HomePage";
import Signup from "../Components/Signup";
import Login from "../Components/Login";
import StartupProfileForm from "../MentorComponents/StartupProfileForm";
import ViewStartupProfiles from "../MentorComponents/ViewStartupProfiles";
import StartupSubmissions from "../MentorComponents/StartupSubmissions";
import ViewStartupOpportunities from "../EntrepreneurComponents/ViewStartupOpportunities";
import SubmitIdea from "../EntrepreneurComponents/SubmitIdea";
import MySubmissions from "../EntrepreneurComponents/MySubmissions";
import ErrorPage from "../Components/ErrorPage"

const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role === "Mentor") return <Navigate to="/mentor/home" replace />;
  if (role === "Entrepreneur") return <Navigate to="/entrepreneur/home" replace />;
  return <Navigate to="/home" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/mentor/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/add-startup-profile"
        element={
          <PrivateRoute>
            <StartupProfileForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/edit-profile/:id"
        element={
          <PrivateRoute>
            <StartupProfileForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/view-profiles"
        element={
          <PrivateRoute>
            <ViewStartupProfiles />
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/submissions"
        element={
          <PrivateRoute>
            <StartupSubmissions />
          </PrivateRoute>
        }
      />

      <Route
        path="/entrepreneur/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/entrepreneur/mentor-opportunities"
        element={
          <PrivateRoute>
            <ViewStartupOpportunities />
          </PrivateRoute>
        }
      />
      <Route
        path="/entrepreneur/my-submissions"
        element={
          <PrivateRoute>
            <MySubmissions />
          </PrivateRoute>
        }
      />
      <Route
        path="/entrepreneur/submit-idea"
        element={
          <PrivateRoute>
            <SubmitIdea />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;
