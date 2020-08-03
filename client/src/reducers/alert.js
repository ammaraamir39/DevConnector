import {SET_ALERT , REMOVE_ALERT} from '../actions/types';

//initial state will be consisting of objects that contain the alert messages
const initialState=[];


export default function(state=initialState,action){

  const {type, payload } = action ;
  //action consist of the type and a payload that will be data
  //but sometimes there might not be an data you just call an action type
  //type determining
  switch(type){
    case SET_ALERT:
      //depending on the we need to decide about the state
      //because state is immutable so we have to include any state that has to be changed
      return [...state,payload]
      //the above return will set a new alert in the array

    case REMOVE_ALERT:
      //we will filter the alert by checking the alerrt id so it will filter all the alerts 
      //accept which matches the id 
      return state.filter(alert=>alert.id !== payload)
    
    default:
      return state;
  }

}
