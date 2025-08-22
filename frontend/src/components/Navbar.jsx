import React from 'react'
import {FaRegWindowClose} from "react-icons/fa"
import { Link, NavLink } from 'react-router-dom'

const Navbar = ({containerStyles, toggleMenu, menuOpened}) => {

    const navItems = [
        {to:"/", label:"Home"},
        {to:"/tutors", label:"Tutors"},
        {to:"/blog", label:"Blog"},
        {to:"/contact", label:"Contact"},
    ]

    return (
        <nav className={containerStyles}>
            {/* Close button inside the navbar */}
            {menuOpened && (
                <>
                <FaRegWindowClose onClick={toggleMenu} className='text-xl self-end cursor-pointer relative left-8'/>
                {/*logo*/} 
                <Link to={'/'} className='bold-24 flex pb-12'>
                    <span className='inline-flex'>
                        Mentee
                    </span>
                </Link>
                </>
            )}
            {navItems.map(({to, label})=>(
                <div key={label} className='inline-flex'>
                    <NavLink to={to} className={({isActive})=> (isActive ? "active-link": "")}>
                        <h5 className='medium-16'>{label}</h5>
                    </NavLink>
                </div>
            ))}
        </nav>
    )
}

export default Navbar;