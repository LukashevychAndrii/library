import { createSlice } from "@reduxjs/toolkit";

interface initialStateI{
    alertTitle:string,
    alertText:string,
    alertType:string
}
const initialState:initialStateI = {
    alertTitle:"",
    alertText:"",
    alertType:"",
}

const alertSlice = createSlice({name:"alert",initialState:initialState,reducers:{
    createAlert(state,action){
        state.alertText = action.payload.alertText
        state.alertTitle = action.payload.alertTitle
        state.alertType = action.payload.alertType
    },
    clearAlert(state){
        state.alertText = ""
        state.alertTitle=""
        state.alertType=""
    }
}})

export default alertSlice.reducer
export const {createAlert,clearAlert} = alertSlice.actions
