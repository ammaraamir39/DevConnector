import axios from 'axios';
import { setAlert } from './alert';
import { 
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE
  ,
  EMPTY_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILES,
  GET_REPOS
} from './types';


//getting  current profile
export const getCurrentProfile = () => async dispatch =>{
  try {
  //  console.log('inside get curent profile')
      const res = await axios.get('/api/profile/me');
     
      dispatch({
        type:GET_PROFILE,
        payload:res.data
      })


  } catch (err) {
    dispatch({
      type:PROFILE_ERROR,
      payload:{
        msg:err.response.statusText,
        status:err.response.status
      }
    })   
  }
} 

//getting  all Profiles
export const getProfiles = () => async dispatch => {
  try {

    dispatch({type:EMPTY_PROFILE})
    //  console.log('inside get curent profile')
    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    })


  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
} 

//get Profile by user id 
export const getProfileByUserId = userId => async dispatch => {
  try {

    
    //  console.log('inside get curent profile')
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })


  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
} 

//Get Github repos

export const getGithubRepos = username => async dispatch => {
  try {

    dispatch({ type: EMPTY_PROFILE })
    //  console.log('inside get curent profile')
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    })


  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
} 


// creating a profile
//history will be an object to redirect after creating the profile
export const createProfile = (formData, history, edit=false)=>async dispatch => {
    try {
    
      const config={
        headers:{
          'Content-Type':'application/json'
        }
      }

      const res = await axios.post('/api/profile',formData,config)

      dispatch({
        type:GET_PROFILE,
        payload:res.data
      })
      //if edit is true so profile updated else creating profile wioll bee shown
      dispatch(setAlert(edit ? 'Profile-Updated' : 'Profile Created','success'))

      //if edditing so we are not going to redirect 
      //if create then we gna redirect to dashboard
      console.log(edit);
      if(!edit){
          
          history.push('/dashboard');
      }

    } catch (err) {
      const errors = err.response.data.errors;
      //console.log(errors)
      if (errors) {

        errors.forEach(error => {
          dispatch(setAlert(error.msg, 'danger'))
        });
      }

      dispatch({
        type:PROFILE_ERROR,
        payload:{msg:err.response.statusText,status:err.response.status}
      })
    }
}

//ADDING EXPERIENCE

export const addExperience = (formData, history) =>async dispatch =>{
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.put('/api/profile/experience', formData, config)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    //if edit is true so profile updated else creating profile wioll bee shown
    dispatch(setAlert('Experience Added', 'success'))

    //if edditing so we are not going to redirect 
    //if create then we gna redirect to dashboard
  
      history.push('/dashboard');
    

  } catch (err) {
    const errors = err.response.data.errors;
    //console.log(errors)
    if (errors) {

      errors.forEach(error => {
        dispatch(setAlert(error.msg, 'danger'))
      });
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//ADDING Education

export const addEducation = (formData, history) => async dispatch => {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.put('/api/profile/education', formData, config)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    //if edit is true so profile updated else creating profile wioll bee shown
    dispatch(setAlert('Education Added', 'success'))

    //if edditing so we are not going to redirect 
    //if create then we gna redirect to dashboard

    history.push('/dashboard');


    } catch (err) {
      const errors = err.response.data.errors;
      //console.log(errors)
      if (errors) {

        errors.forEach(error => {
          dispatch(setAlert(error.msg, 'danger'))
        });
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
}

//Deleting Experience

export const deleteExperience = id => async dispatch =>{
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type:UPDATE_PROFILE,
      payload:res.data
    })

    dispatch(setAlert('Experience Removed', 'success'))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}


//Deleting Education

export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    dispatch(setAlert('Education Removed', 'success'))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//Deleting profile and account

export const deleteAccount = () => async dispatch => {
 if(window.confirm('Are you sure ? because you cannot undo it')){
   try {
     await axios.delete(`/api/profile`);
     dispatch({
       type: EMPTY_PROFILE,
     })
     dispatch({
       type: ACCOUNT_DELETED
     })

     dispatch(setAlert('Your Account has permanently been deleted'))
   } catch (err) {
     dispatch({
       type: PROFILE_ERROR,
       payload: { msg: err.response.statusText, status: err.response.status }
     })
   }
 }
}