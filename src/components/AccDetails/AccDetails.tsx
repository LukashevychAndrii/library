import React from 'react'
import styles from "./AccDetails.module.scss"
import { useAppSelector } from '../../hooks/redux'
import { useNavigate } from 'react-router-dom';

const AccDetails = () => {
  const accDetails = useAppSelector(state=>state.user);
  const navigate = useNavigate()
  React.useEffect(()=>{
    if(!accDetails){
      navigate("/library")
    }
  },[accDetails,navigate])

  return (
    <div className={styles["acc-details"]}>
      <div>{accDetails.userName}</div>
      <div>{accDetails.email}</div>
      <div>{accDetails.password}</div>
      <div>{accDetails.userID}</div>
      
    </div>
  )
}

export default AccDetails
