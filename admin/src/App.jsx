import { ToastContainer } from "react-toastify"
import Sidebar from "./components/Sidebar"
import { Route, Routes } from 'react-router-dom'
import AllSessions from "./pages/admin/AllSessions"
import Dashboard from "./pages/admin/Dashboard"
import AddTutor from "./pages/admin/AddTutor"
import TutorsList from "./pages/admin/TutorsList"
import Login from "./pages/Login"
import { useContext } from "react"
import { AdminContext } from "./context/AdminContext"

export default function App() {

  const {aToken, seAToken} = useContext(AdminContext)

  return aToken ? (
    <main>
      <ToastContainer  position="bottom-right"/>
      <div className="bg-light text-tertiary">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row">
          <Sidebar />
          <Routes>
            {/* ADMIN ROUTES */}
            <Route path="/" element={<></>}/>
            <Route path="/admin-dashboard" element={<Dashboard/>}/>
            <Route path="/all-sessions" element={<Dashboard/>}/>
            <Route path="/add-tutor" element={<AddTutor/>}/>
            <Route path="/tutors-list" element={<TutorsList/>}/>
          </Routes>
        </div>
      </div>
    </main>
  ) : (
    <main>
      <ToastContainer position="bottom-right"/>
      <Login/>
    </main>
  )
}