import React, { useContext, useState } from 'react';
import profileImage from "../assets/user.jpg";
import upload_icon from "../assets/upload_icon.png";
import { AppContext } from "../context/AppContext" ;
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
    const [selectedImage, setSelectedImage] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const {userData, setUserData, token, backendUrl, loadUserProfileData} = 
        useContext(AppContext);

    const handleProfileUpdate = async () => {
        try{
            const formData = new FormData()

            formData.append("name", userData.name);
            formData.append("email", userData.email);
            formData.append("phone", userData.phone);
            formData.append("address", JSON.stringify(userData.address || {}));
            formData.append("gender", userData.gender);
            formData.append("dob", userData.dob);

            if(selectedImage){
                formData.append("image", selectedImage);
            }
            const {data} = await axios.post(
                backendUrl + '/api/user/update-profile', 
                formData, 
                {headers: {token}}
            );

            if(data.success){
                toast.success(data.message)
                await loadUserProfileData()
                setIsEditing(false)
                setSelectedImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error){
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleChange = (e)=>{
        const {name, value} = e.target

        if(name === "city" || name === "country"){
            setUserData((prev)=> ({...prev, address:{...prev.address, [name]:value}}))
        } else {
            setUserData((prev)=> ({...prev, [name]:value}))
        }
    }

    return (
        userData && (
            <div className='max-padd-container px-4 py-28'>
                <div className='max-w-sm w-full'>
                    <div className='flex flex-col relative'>
                        <div className='relative w-32 h-32'>
                            <img src={selectedImage ? URL.createObjectURL(selectedImage) : userData.image || upload_icon} alt="" className='h-32 w-32 rounded-md object-cover'/>
                            {isEditing && (
                                <>
                                    <label htmlFor="image" className='absolute inset-0 flexCenter bg-black bg-opacity-50 rounded-md cursor-pointer transition-opacity hover:opacity-80'>
                                        <span className="text-white text-xs font-semibold">Upload</span>
                                    </label>
                                    <input type="file" id='image' accept='image/*' hidden onChange={(e)=>setSelectedImage(e.target.files[0])}/>
                                </>
                            )}
                        </div>
                        <h4 className='text-2xl font-bold mt-4'>{userData.name}</h4>
                        <p className='text-gray-500'>{userData.email}</p>
                    </div>
                    <hr className='my-3'/>
                
                

                    {/* Personal Details*/}
                    <h4 className='h4 text-gray-500 mb-3'>Personal Details</h4>
                    <div className='space-y-4'>
                        <div className='flex flex-col sm:flex-row sm:items-center space-3'>
                            <label className='bold-14 min-w-44'>Name</label>
                            {isEditing ? (
                                <input type="text" name='name' value={userData.name} onChange={handleChange} className='regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded' />
                            ) : (
                                <p className="mt-1">{userData.name}</p>
                            )}
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-center space-3'>
                            <label className='bold-14 min-w-44'>Phone</label>
                            {isEditing ? (
                                <input type="text" name='phone' value={userData.phone} onChange={handleChange} className='regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded' />
                            ) : (
                                <p className="mt-1">{userData.phone}</p>
                            )}
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-center space-3'>
                            <label className='bold-14 min-w-44'>Date of Birth</label>
                            {isEditing ? (
                                <input type="text" name='dob' value={userData.dob} onChange={handleChange} className='regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded' />
                            ) : (
                                <p className="mt-1">{userData.dob}</p>
                            )}
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-center space-3'>
                            <label className='bold-14 min-w-44'>Gender</label>
                            {isEditing ? (
                                <select name='gender' value={userData.gender} onChange={handleChange} className='regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded'>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            ) : (
                                <p className="mt-1">{userData.gender}</p>
                            )}
                        </div>
                    </div>
                    <hr className='my-3'/>

                    {/* Location Details */}
                    <h4 className='h4 text-gray-500 my-3'>Location Details</h4>
                    <div className='space-y-4'>
                        <div className='flex flex-col sm:flex-row sm:items-center space-3'>
                            <label className='bold-14 min-w-44'>City</label>
                            {isEditing ? (
                                <input type="text" name='city' value={userData.address?.city || ""} onChange={handleChange} className='regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded' />
                            ) : (
                                <p className="mt-1">{userData.address?.city || "-"}</p>
                            )}
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-center space-3'>
                            <label className='bold-14 min-w-44'>Country</label>
                            {isEditing ? (
                                <input type="text" name='country' value={userData.address?.country || ""} onChange={handleChange} className='regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded' />
                            ) : (
                                <p className="mt-1">{userData.address?.country || "-"}</p>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={()=> {
                            if (isEditing) {
                                handleProfileUpdate();
                            } else {
                                setIsEditing(true);
                            }
                        }} 
                        className='mt-6 btn-secondary min-w-64'
                        >
                            {isEditing ? "Save Changes" : "Edit Profile"}
                    </button>
                </div>
            </div>
        )
    )
}

export default MyProfile