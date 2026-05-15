import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"

import Home from "./pages/Home/Home"
import EventDetail from "./pages/EventDetail/EventDetail"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import Dashboard from "./pages/Dashboard/Dashboard"
import Admin from "./pages/Admin/Admin"
import EventForm from "./pages/EventForm/EventForm"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage"

import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/new" element={
            <ProtectedRoute roles={["ORGANIZER", "ADMIN"]}>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/edit" element={
            <ProtectedRoute roles={["ORGANIZER", "ADMIN"]}>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
