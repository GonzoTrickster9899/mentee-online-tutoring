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
import { TutorContext } from "./context/TutorContext"
import TutorDashboard from "./pages/tutor/TutorDashboard"
import TutorProfile from "./pages/tutor/TutorProfile"
import TutorSessions from "./pages/tutor/TutorSessions"

export default function App() {

  const {aToken, setAToken} = useContext(AdminContext)
  const {tToken, setTToken} = useContext(TutorContext)

  return aToken || tToken ? (
    <main>
      <ToastContainer  position="bottom-right"/>
      <div className="bg-light text-tertiary">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row">
          <Sidebar />
          <Routes>
            {/* ADMIN ROUTES */}
            <Route path="/" element={<></>}/>
            <Route path="/admin-dashboard" element={<Dashboard/>}/>
            <Route path="/all-sessions" element={<AllSessions/>}/>
            <Route path="/add-tutor" element={<AddTutor/>}/>
            <Route path="/tutors-list" element={<TutorsList/>}/>

            {/* TUTOR ROUTES */}
            <Route path="/tutor-dashboard" element={<TutorDashboard/>}/>
            <Route path="/tutor-profile" element={<TutorProfile/>}/>
            <Route path="/tutor-sessions" element={<TutorSessions/>}/>
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