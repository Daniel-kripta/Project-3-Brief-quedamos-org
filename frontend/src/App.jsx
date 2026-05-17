import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
import StaticPage from "./pages/StaticPage/StaticPage"
import Info from "./pages/Info/Info"
import ContactPage from "./pages/ContactPage/ContactPage"
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/info/sobre-el-proyecto" element={ <Info/> } />
            <Route path="/info/contacto" element={<ContactPage />} />
            <Route path="/info/:slug" element={<StaticPage/>} />
            <Route path="/info" element={ <Navigate to="/info/sobre-el-proyecto" />} />
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
        </ErrorBoundary>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
