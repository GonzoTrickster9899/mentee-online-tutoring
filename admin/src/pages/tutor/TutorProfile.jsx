import React from 'react'
import { useContext } from 'react'
import { TutorContext } from '../../context/TutorContext'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'

const TutorProfile = () => {

  const {tToken, setProfileData, profileData, getProfileData} = useContext(TutorContext)
  const {backendUrl, currency} = useContext(AppContext)
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdateProfile = async ()=>{
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      }

      const {data} = await axios.post(backendUrl + '/api/tutor/update-profile', updateData, {headers:{tToken}})

      if(data.success){
        toast.success(data.message)
        setIsEditing(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(tToken){
      getProfileData()
    }
  }, [tToken])

  return ( 
    profileData && (
      <div className='px-2 sm:px-8 py-12 h-screen sm:pl-[23%] lg:w-11/12'>
        <div className='max-w-sm w-full'>
          <div className='flex flex-col relative'>
            <div className='relative w-32 h-32 overflow-hidden rounded-md'>  
              <img src={profileData.image} alt=""/>
              <span className='absolute inset-0 bg-black bg-opacity-10' />
            </div>
            <h2 className='text-2xl font-bold mt-4'>{profileData.name}</h2>
            <p className="text-gray-500">{profileData.email}</p>
          </div>
          <hr className='my-3'/>
          <div>
            <label className='bold-14 min-w-44'>About</label>
            <p className="mt-1">{profileData.about}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="bold-14 min-w-44">Fees</label>
            {isEditing ? (
              <input 
                type="text"
                name="fees"
                value={profileData.fees || ""}
                onChange={(e)=>setProfileData(prev=>({...prev, fees: e.target.value}))}
                className="regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded" 
              />
            ) : (
              <p className="mt-1">{currency}{profileData.fees}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
            <label className="bold-14 min-w-44">Available</label>
            {isEditing ? (
              <input
                type="checkbox"
                name="available"
                checked={profileData.available}
                onChange={(e)=>setProfileData(prev=>({...prev, available: !prev.available}))}
                className="w-4 h-4"
              />
            ) : (
              <p className="mt-1">{profileData.available ? "Yes" : "No"}</p>
            )}
          </div>

          {/* Location Details */}
          <h4 className='h4 text-gray-500 my-3'>Location Details</h4>
          <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row sm:items-center space-3'>
                  <label className='bold-14 min-w-44'>City</label>
                  {isEditing ? (
                      <input 
                      type="text" 
                      name='city' 
                      value={profileData.address?.city || ""} 
                      onChange={(e)=>setProfileData(prev=>({...prev, address: {...prev.address, city:e.target.value}}))} 
                      className="regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded" />
                  ) : (
                      <p className="mt-1">{profileData.address?.city}</p>
                  )}
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center space-3'>
                  <label className='bold-14 min-w-44'>Country</label>
                  {isEditing ? (
                      <input 
                        type="text" 
                        name='country' 
                        value={profileData.address?.country || ""} 
                        onChange={(e)=>setProfileData(prev=>({...prev, address: {...prev.address, country:e.target.value}}))} 
                        className='regular-14 border p-0.5 px-2 w-full sm:w-2/3 rounded'
                      />
                  ) : (
                    <p className="mt-1">{profileData.address?.country || "-"}</p>
                  )}
              </div>
              <button 
                onClick={()=> isEditing ? handleUpdateProfile() : setIsEditing(true)} 
                className='mt-6 btn-secondary min-w-64'
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
          </div>
        </div>
      </div>
    )
  );
}

export default TutorProfile