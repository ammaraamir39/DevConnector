import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOAD_USER,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  EMPTY_PROFILE,
  ACCOUNT_DELETED
} from '../actions/types';

const initialState = {
  token:localStorage.getItem('token'),
  isAuthenticated:null, //for registration succass and failure
  loading:true, //when the data will come we will set it back to false 
  user:null //it consist of the user attributes
}

export default function(state=initialState,action ){

  const {type,payload} = action;

  switch(type){
    case LOAD_USER:
      return {
        ...state,
        isAuthenticated:true,
        loading:false,
        user:payload
      }

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token',payload.token)
      return {
        ...state,
        ...payload,
        isAuthenticated:true,
        loading:false
      }
    
    case REGISTER_FAILURE:
    case AUTH_ERROR:
    case LOGIN_FAILURE:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token')
      return {
        ...state,
        token:null,
        isAuthenticated:false,
        loading:false
      }

    default:
      return state
  }

}

