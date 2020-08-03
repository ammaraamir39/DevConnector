import { GET_POSTS, GET_POST,ADD_COMMENT,REMOVE_COMMENT , POST_ERROR,UPDATE_LIKES,DELETE_POST,ADD_POST} from '../actions/types';


const initialState={
   posts:[],
  post:null,
  loading:true,
  error:{}
}

export default function (state=initialState,action ){
  const { type, payload } = action;

  switch(type){
    case GET_POSTS:
      return{
        ...state,
        posts:payload,
        loading : false
      }
    case GET_POST:
      return {
        ...state,
        post:payload,
        loading:false
      }


    case DELETE_POST:
      return{
        ...state,
        //it will filter out all the posts excet the one which matches he payload id
        posts:state.posts.filter(post=>post._id !== payload),
        loading:false
      }
    case UPDATE_LIKES:
      return {
        ...state,
        posts:state.posts.map(post => post._id === payload.postId ? {...post,likes:payload.likes}:post),
        loading:false
      }
    case ADD_POST:
      return {
        ...state,
        posts:[payload,...state.posts],
        loading:false 
      }
    case POST_ERROR:
      return{
        ...state,
        error:payload,
        loading:false
      }
    case ADD_COMMENT:
      return {
        ...state,
        post:{...state.post,comments:payload},
        loading:false
      }
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          //we want to bring all the comments except for the one with same id as comment deletd
          comments:state.post.comments.filter(comment=>comment._id !== payload)
        },
        loading:false
      }

    default:return state
  }
}