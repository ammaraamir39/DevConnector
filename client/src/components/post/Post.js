import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types';
import {Link } from 'react-router-dom';
import { connect} from 'react-redux';
import {getPost} from '../../actions/post';
import PostItem from '../Posts/PostItem';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Spinner from '../layout/spinner';

const Post = ({post:{post,loading},getPost,match}) => {
  //match.params.id is the /url which is the user id of the post route
  useEffect(()=>{
   getPost(match.params.id) 
  },[getPost])
  
  return post === null || loading ? <Spinner /> : <Fragment>
    <Link to='/posts' className="btn btn-primary">Go Back To Posts</Link>
    <PostItem post={post} showActions={false}/>
    <CommentForm postId={post._id}/>
    <div className="comments">
      {post.comments.map(comment=>(
        <CommentItem key={comment._id} comment={comment}  postId={post._id}/>
      ))}
    </div>
  </Fragment>
}

Post.propTypes = {
getPost:PropTypes.func.isRequired,
post:PropTypes.object.isRequired
}

const mapStateToProps =state=>({
  post:state.post
})

export default connect(mapStateToProps,{getPost})(Post)
