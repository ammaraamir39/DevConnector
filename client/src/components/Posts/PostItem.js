import React,{Fragment} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { addLike , removeLike,deletePost } from '../../actions/post';
import Moment from 'react-moment';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  showActions,//Show Actions is used to show the buttons(Like,discussion,unlike) when its true
  auth, post:{_id, name ,avatar , text , user , likes, comments , date}}) => {
  return (
    <div class="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img
            class="round-img"
            src={avatar}
            alt=""
          />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p class="my-1">
          {text}  </p>
        <p class="post-date">
          Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
            </p>
          {showActions && <Fragment>
          <button onClick={e => addLike(_id)} type="button" class="btn btn-light">
            <i class="fa fa-thumbs-up"></i>{' '}
            {likes.length > 0 && (
              <span>{likes.length}</span>
            )}
          </button>
          <button onClick={e => removeLike(_id)} type="button" class="btn btn-light">
            <i class="fa fa-thumbs-down"></i>
          </button>
          <Link to={`/post/${_id}`} class="btn btn-primary">
            Discussion {comments.length > 0 && (
              <span class='comment-count'>{comments.length}</span>
            )}
          </Link>
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={e => deletePost(_id)}
              type="button"
              class="btn btn-danger">
              <i class="fa fa-times"></i>
            </button>
          )}
        </Fragment>}
      
          </div>
    </div>
  )
}


PostItem.defaultProps={
  showActions:true
}

PostItem.propTypes = {
post:PropTypes.object.isRequired,
auth:PropTypes.object.isRequired,
addLike:PropTypes.func.isRequired,
removeLike:PropTypes.func.isRequired,
deletePost:PropTypes.func.isRequired
}
const mapStateToProps =state=>({
  auth:state.auth,
  
})

export default connect(mapStateToProps,{addLike,removeLike,deletePost})(PostItem);
