import {SET_ALERT , REMOVE_ALERT} from './types';
import {v4 as uuid} from 'uuid';

export const setAlert = (msg,alertType,timeout=5000) => dispatch =>{
  //uuid generates the random universal id
  const id=uuid();
  //we are going to call the SET_ALERT from reducer
  dispatch({
    type:SET_ALERT,
    payload:{
      msg,
      alertType,
      id
    }
  })

  //we gna remove the alert after 5 seconds 
  setTimeout(()=>dispatch({type:REMOVE_ALERT,payload:id}),timeout)

}