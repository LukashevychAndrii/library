import React from 'react'
import styles from "./Alert.module.scss"
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { clearAlert } from '../../store/slices/alert-slice'

const Alert = () => {
    const alertData = useAppSelector(state=>state.alert)
    const dispatch = useAppDispatch()

    React.useEffect(()=>{
        if(alertData.alertText.length>0
            &&alertData.alertTitle.length>0
            &&alertData.alertType.length>0)
        {
            setTimeout(() => {
                dispatch(clearAlert())
            }, 5000);
        }
    },[alertData,dispatch])


  return (
    <div className={`${styles["alert-window"]} ${styles[`alert-window--${alertData.alertType}`]}`}>
      <div className={`${styles["alert-window__content"]} ${styles[`alert-window__content--${alertData.alertType}`]}`}>   
        <span className={styles["alert-window__content--title"]}>{alertData.alertTitle}</span>
        <span className={styles["alert-window__content--text"]}>{alertData.alertText}</span>
        <span onClick={()=>{
            dispatch(clearAlert())
        }} className={styles["alert-window__content--close-btn"]}>&times;</span>
      </div>
    </div>
  )
}

export default Alert
