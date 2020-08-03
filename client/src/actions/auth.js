import  { 
  REGISTER_SUCCESS ,
  REGISTER_FAILURE,
  LOAD_USER,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  EMPTY_PROFILE
} from './types';
import {setAlert} from './alert';
import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';



//LOGOUT/clear profile
export const logout=()=>dispatch=>{
  dispatch({
    type:EMPTY_PROFILE
  })
  dispatch({
    type:LOGOUT
  })
}

//LOAD USER
export const loadUser=()=>async dispatch=>{
  if(localStorage.token){
    setAuthToken(localStorage.token)
  }

  try {
      const res = await axios.get('/api/auth');

      dispatch({
        type:LOAD_USER,
        payload:res.data
      })
  } catch (err) {
    dispatch({
      type:AUTH_ERROR
    })
  }
}



//REGISTER USER
export const register = ({name, email, password })=>async dispatch=>{
  const config = {
    headers:{
      'Content-Type':'application/json'
    }
  }

  const body = JSON.stringify({name, email, password});

  try {
    const res = await axios.post('/api/users',body,config);
    console.log(res.data)
    dispatch({
      type:REGISTER_SUCCESS,
      payload:res.data
    })
    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors)
    if(errors){
        
        errors.forEach(error => {
          dispatch(setAlert(error.msg,'danger'))
        });
    }
    dispatch({
      type:REGISTER_FAILURE
    })
  }
}

//LOGIN USER
export const login = ( email, password ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors)
    if (errors) {

      errors.forEach(error => {
        dispatch(setAlert(error.msg, 'danger'))
      });
    }
    dispatch({
      type: LOGIN_FAILURE
    })
  }
}