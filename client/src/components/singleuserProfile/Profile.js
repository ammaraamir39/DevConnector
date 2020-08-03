import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import {getProfileByUserId } from '../../actions/profile';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
import Spinner from '../layout/spinner';
import {Link} from 'react-router-dom';

const Profile = ({ getProfileByUserId, profile: { profile, loading }, auth,match}) => {
 //match: this.props.match.params is used to get the user id from the url
useEffect(()=>{
  getProfileByUserId(match.params.id)
},[getProfileByUserId,match.params.id])
 
  return (
    <Fragment>
      
      {profile === null  || loading ? <Spinner /> : 
        
        <Fragment>
        
          <Link to="/profiles" className="btn btn-primary">Back to Profile</Link>
          {profile.length === 0 ? <h4 className="my-1">No Profile Found</h4> : <Fragment>
            {

              auth.isAuthenticated && auth.loading === false && auth.user._id === profile[0].user._id
              && (<Link to="/edit-profile" className="btn btn-dark">Edit Profile</Link>)
            }

            <div class="profile-grid my-1">
              <ProfileTop profile={profile[0]} />
              <ProfileAbout profile={profile[0]} />
              <div className="profile-exp bg-white p-2">
                <h2 className="text-primary">Experience</h2>

                {profile[0].experience.length > 0 ? (<Fragment>

                  {profile[0].experience.map(experience => (

                    <ProfileExperience key={experience._id} experience={experience} />
                  ))}
                </Fragment>) : (<h4>No Experience Credentials</h4>)}
              </div>
              <div className="profile-edu bg-white p-2">
                <h2 className="text-primary">Education</h2>

                {profile[0].education.length > 0 ? (<Fragment>
                  {profile[0].education.map(education => (
                    <ProfileEducation key={education._id} education={education} />
                  ))}
                </Fragment>) : (<h4>No Education Credentials</h4>)}
              </div>

            </div>  
            
            </Fragment>
          }

          
        </Fragment>}
    </Fragment>
  )
  }
Profile.propTypes = {
getProfileByUserId:PropTypes.func.isRequired,
profile:PropTypes.object.isRequired,
auth:PropTypes.object.isRequired,
}

const mapStateToProps =state=>({
  profile:state.profile,
  auth:state.auth
})

export default connect(mapStateToProps,{getProfileByUserId})(Profile)
