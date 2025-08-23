// API FOR ADDING A TUTOR FOR ADMIN PANEL
const addTutor = async (req,res) =>{
    try{
        const {name,email,password, qualification, subject, experience, about, fees, address} = req.body
    } catch (error) {

    }
}

export {addTutor}