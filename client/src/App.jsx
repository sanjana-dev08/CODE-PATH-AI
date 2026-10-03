import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Feature1 = lazy(() => import("./pages/Feature1"));
const Feature2 = lazy(() => import("./pages/Feature2"));
const Feature3 = lazy(() => import("./pages/Feature3"));
const Feature4 = lazy(() => import("./pages/Feature4"));
const Feature5 = lazy(() => import("./pages/Feature5"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader label="Opening CodePath AI" />}>
      <Routes>

        {/* First page */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main pages */}
        <Route path="/landing" element={<Landing />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/feature1" element={<Feature1 />} />
          <Route path="/feature2" element={<Feature2 />} />
          <Route path="/feature3" element={<Feature3 />} />
          <Route path="/feature4" element={<Feature4 />} />
          <Route path="/feature5" element={<Feature5 />} />
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;