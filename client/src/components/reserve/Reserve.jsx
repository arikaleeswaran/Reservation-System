import React, { useContext, useState } from 'react'
import "./reserve.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../../hooks/useFetch'
import { SearchContext } from '../../context/SearchContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Reserve({setOpen,hotelId}) {

    const [selectedRooms,setSelectedRooms] = useState([])
    const {data = [],loading,error} = useFetch(`/hotels/room/${hotelId}`)
    const{dates =[]} = useContext(SearchContext);

    const getDatesInRange = (startDate,endDate)=>{
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date =new Date(start.getTime());
        const dates =[];

        while(date <= end){
            dates.push(new Date(date).getTime())
            date.setDate(date.getDate()+1)
        }
        return dates;
    }
    const allDates = dates[0]?.startDate && dates[0]?.endDate
    ? getDatesInRange(dates[0].startDate, dates[0].endDate)
    : [];
    console.log(allDates);
    
    const isAvailable = (roomNumber) =>{

        if (!allDates.length) return false;

         return !roomNumber.unavailableDates.some((date) => 
            allDates.includes(new Date(date).getTime())
        );
    }

    const handleSelect = (e) =>{
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(checked ? [...selectedRooms,value] : selectedRooms.filter(item => item !== value))
    }

    // console.log(selectedRooms);

    const navigate = useNavigate()

    const handleClick = async ()=>{
        try{
            await Promise.all(
                selectedRooms.map(async (roomId)=>{
                    try{
                        const res = await axios.put(`/rooms/availability/${roomId}`,{
                            dates : allDates,
                        });
                        return res.data;
                    }catch(roomErr){
                        console.error(`Failed to update room ${roomId}:`,roomErr);
                        throw roomErr;
                    }
                
            })
        );
        setOpen(false);
        navigate("/")
        }catch(err){
            alert("Failed to reserve rooms. Please try again.");
        }
}

  return (
    <div className='reserve'>
        <div className="rContainer">
            <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={()=>setOpen(false)}/>
            <span>Select your room:</span>
            {data.map((item)=>(
                <div className="rItem" key={item._id}>
                    <div className="rItemInfo">
                    <div className="rTitle">{item.title}</div>
                    <div className="rDesc">{item.desc}</div>
                    <div className="rMax">Max people: <b>{item.maxPeople}</b></div>
                    <div className="rPrice">{item.price}</div>
                    </div>
                    <div className="rSelectRooms">
                    
                    {item.roomNumbers.map((roomNumber)=>(
                       <div className="room"> 
                        <label>{roomNumber.number}</label>
                        <input 
                        type="checkbox" 
                        value={roomNumber._id} 
                        onChange={handleSelect}
                        disabled={!isAvailable(roomNumber)}
                        />
                       </div>
                    ))}
                    </div>
                </div>
            ))}
            <button onClick={handleClick} className="rButton">Reserve Now!</button>
        </div>
    </div>
  )
}

export default Reserve