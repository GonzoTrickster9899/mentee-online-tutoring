import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MySessions from "./pages/MySessions";
import Tutors from "./pages/Tutors";
import Verify from "./pages/Verify";
import Session from "./pages/Session";
import Footer from "./components/Footer";

export default function App() {
  return (
    <main className="overflow-hidden bg-light text-tertiary">
      <Header />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/tutors" element={<Tutors/>}/>
        <Route path="/tutors/:subject" element={<Tutors/>}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/my-profile" element={<MyProfile/>}/>
        <Route path="/my-sessions" element={<MySessions/>}/>
        <Route path="/session/:tutId" element={<Session/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
      <Footer />
    </main>
  )
}