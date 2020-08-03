import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';
import Spinner from '../layout/spinner';

const Profiles = ({profile:{loading,profiles},getProfiles}) => {
  useEffect(()=>{
    getProfiles();
  },[getProfiles])
  
  return (
    <Fragment>
      {loading ? <Spinner/> : <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fa fa-connectdevelop"></i>Connect with Developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? profiles.map(profile=>(
              <ProfileItem key={profile._id} profile={profile}/>
            )) : <h4>No Profile Found</h4> }
          </div>
        </Fragment>}
    </Fragment>
  )
}

Profiles.propTypes = {
  profile:PropTypes.object.isRequired,
  getProfiles:PropTypes.func.isRequired,
}

const mapStateToProps=state=>({
  profile:state.profile
})

export default connect(mapStateToProps,{getProfiles})(Profiles);
