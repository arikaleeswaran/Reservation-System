import React from 'react'
import "./reserve.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

function Reserve({setOpen,hotelId}) {
  return (
    <div className='reserve'>
        <div className="rConatainer">
            <FontAwesomeIcon icon={faCircleXmark} className='rClose' onClick={()=>setOpen(false)}/>
            <span>Select your room:</span>
        </div>
    </div>
  )
}

export default Reserve