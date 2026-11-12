import React, { useState, useContext } from "react";
import upload_icon from "../../assets/upload_icon.png"
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const AddTutor = () => {
  // Local state hooks for form fields
  const [tutImg, setTutImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [subject, setSubject] = useState("Science");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [qualification, setQualification] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const {aToken} = useContext(AdminContext)
  const {backendUrl} = useContext(AppContext)

  // Handle image upload
  const handleImageChange = (e)=>{
    setTutImg(e.target.files[0])
  }

  // Handle for submission
  const onSubmitHandler = async (e)=>{
    e.preventDefault()

    try {
      if(!tutImg){
        return toast.error("Please select an image first.")
      } 

      // Prepare data for backend
      const formData = new FormData()
      formData.append("image", tutImg)
      formData.append("name", name)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("experience", experience)
      formData.append("subject", subject)
      formData.append("fees", fees)
      formData.append("about", about)
      formData.append("qualification", qualification)
      formData.append("address", JSON.stringify({city, country}))

      // Send request to backend
      const {data} = await axios.post(
        backendUrl + '/api/admin/add-tutor', 
        formData, 
        { headers: {aToken} }
      );
      if(data.success){
        toast.success(data.message)
        // Reset Form
        setTutImg(false)
        setName("")
        setEmail("")
        setPassword("")
        setExperience("1 Year")
        setFees("")
        setAbout("")
        setSubject("Science")
        setQualification("")
        setCity("")
        setCountry("")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add tutor")
    }
  };

  return (
    <div className="px-2 sm:px-8 py-12 h-screen sm:pl-[23%]">
      <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-4 lg:gap-12 medium-14">
        {/* ================================LEFT SIDE =======================*/}
        <div className="flex gap-y-3 flex-col">
          <div className="w-full">
            <h5 className="h5">Tutor Name</h5>
            <input 
              onChange={(e)=>setName(e.target.value)}
              value={name}            
              type="text" 
              placeholder="Write here..." 
              className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full"
            />
          </div>
          <div className="w-full">
            <h5 className="h5">Tutor Email</h5>
            <input 
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              type="email" 
              placeholder="Write here..." 
              className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full"
              />
          </div>
          <div className="w-full">
            <h5 className="h5">Tutor Password</h5>
            <input 
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              type="password" 
              placeholder="Write here.." 
              className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full"
              />
          </div>
          <div className="w-full">
            <h5 className="h5">About Tutor</h5>
            <textarea 
              onChange={(e)=>setAbout(e.target.value)}
              value={about}
              rows={5} 
              placeholder="Write here..." 
              className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full"
            />
          </div>
          <div className="w-full">
            <h5 className="h5">Tutor Address</h5>
            <div className="flex gap-2 w-full">
              <input 
                onChange={(e)=>setCity(e.target.value)}
                value={city}
                type="text" 
                placeholder="Write City..." 
                className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full"
              />
              <input
                onChange={(e)=>setCountry(e.target.value)}
                value={country}
                type="text" 
                placeholder="Write Country..." 
                className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="hidden lg:block btn-dark !rounded mt-3 max-w-44 sm:w-full"
          >
            Add Tutor
          </button>
        </div>
        {/* =============================== RIGHT SIDE ============================= */}
        <div className="flex gap-y-3 flex-col">
          {/* Qualification */}
          <div className="w-full">
            <h5 className="h5">Qualification</h5>
            <input
              onChange={(e)=>setQualification(e.target.value)}
              value={qualification}
              type="text" 
              placeholder="Write qualifications..."
              className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full"
              />
          </div>
          {/* Subject */}
          <div className="w-full">
            <h5 className="h5">Subject</h5>
            <select onChange={(e)=>setSubject(e.target.value)}
              value={subject} className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full">
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Langauges">Langauges</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Arts">Arts</option>
              <option value="Computer">Computer</option>
            </select>
          </div>
          {/* Experience */}
          <div className="w-full">
            <h5 className="h5">Experience</h5>
            <select onChange={(e)=>setExperience(e.target.value)}
              value={experience} className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-full">
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="4 Years">4 Years</option>
              <option value="5 Years">5 Years</option>
              <option value="6 Years">6 Years</option>
              <option value="7 Years">7 Years</option>
              <option value="8 Years">8 Years</option>
              <option value="9 Years">9 Years</option>
              <option value="10 Years">10 Years</option>
              <option value="11 Years">11 Years</option>
            </select>
          </div>
          {/* Fee */}
          <div className="w-full">
            <h5 className="h5">Fees</h5>
            <input
              onChange={(e)=>setFees(e.target.value)}
              value={fees}
              type="number" 
              min={5}
              placeholder="Fees"
              className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-tertiary/5 mt-1 w-20"
              />
          </div>
          {/* Image */}
          <div className="w-full">
            <h5 className="h5">Image</h5>
            <label htmlFor="tutImg">
              <img 
                src={tutImg ? URL.createObjectURL(tutImg) : upload_icon} 
                alt="" 
                className="w-14 h-14 aspect-square object-cover ring-1 ring-slate-900/5 bg-light rounded-lg cursor-pointer"
              />
              <input onChange={handleImageChange} type="file" name="tutImg" id="tutImg" hidden />
            </label>
          </div>
          <button
            type="submit"
            className="block lg:hidden btn-dark !rounded mt-3 max-w-44 sm:w-full"
          >
            Add Tutor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTutor;
