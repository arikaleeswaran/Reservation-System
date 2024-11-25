import React, { useContext, useState } from 'react'
import "./reserve.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../../hooks/useFetch'
import { SearchContext } from '../../context/SearchContext'

function Reserve({setOpen,hotelId}) {

    const [selectRooms,setSelectRooms] = useState([])
    const {data = [],loading,error} = useFetch(`/hotels/room/${hotelId}`)
    const{dates =[]} = useContext(SearchContext);

    const getDatesInRange = (startDate,endDate)=>{
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date =new Date(start.getTime());
        const list =[];

        while(date <= end){
            list.push(new Date(date).getTime())
            date.setDate(date.getDate()+1)
        }
        return list;
    }
    const allDates = dates[0]?.startDate && dates[0]?.endDate
    ? getDatesInRange(dates[0].startDate, dates[0].endDate)
    : [];
    console.log(allDates);
    
    const isAvailable = (roomNumber) =>{
        
    }

    const handleSelect =(e)=>{
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectRooms(checked ? [...selectRooms,value] : selectRooms.filter(item => item !== value))
    }

    // console.log(selectRooms);

    const handleClick = ()=>{

}

  return (
    <div className='reserve'>
        <div className="rConatainer">
            <FontAwesomeIcon icon={faCircleXmark} className='rClose' onClick={()=>setOpen(false)}/>
            <span>Select your room:</span>
            {data.map((item)=>(
                <div className="rItem" key={item._id}>
                    <div className="rItemInfo">
                    <div className="rTitle">{item.title}</div>
                    <div className="rDesc">{item.desc}</div>
                    <div className="rMax">Max people: <b>{item.maxPeople}</b></div>
                    <div className="rPrice">{item.price}</div>
                    </div>
                    {item.roomNumbers.map((roomNumber)=>(
                       <div className="room"> 
                        <label>{roomNumber.number}</label>
                        <input type="checkbox" value={roomNumber._id} onChange={handleSelect}/>
                       </div>
                    ))}
                    
                </div>
            ))}
            <div onClick={handleClick} className="rButton">Reserve Now!</div>
        </div>
    </div>
  )
}

export default Reserve