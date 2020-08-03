import React,{useEffect, Fragment} from 'react'
import PropTypes from 'prop-types'
import { connect} from 'react-redux';
import { getCurrentProfile,deleteAccount } from '../../actions/profile';
import Spinner from '../layout/spinner';
import {Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
const Dashboard = ({getCurrentProfile,deleteAccount,
  auth:{user},
  profile:{profile, loading}}) => {
  
  useEffect(()=>{
    getCurrentProfile();
  },[getCurrentProfile])
  
  return loading && profile === null ? (<Spinner />) : 
  (<Fragment> 
    <h1 className="large text-primary">
      Dashboard
    </h1>
    <p className="lead">
      <i className="fa fa-user"></i>{' '}   
        
         {// if user exists so displat users name
            user && user.name }
    </p>  
    {profile !== null ? <Fragment>
        <DashboardActions/>
        {profile.experience.length > 0 ? <Experience experience={profile.experience} /> : <h4 className="my-2 lead">No experience</h4> }
        {profile.education.length > 0 ? <Education education={profile.education} /> : <h4 className="my-2 lead">No education</h4> }
         
        
        

        <div className="my-2">
          <button className="btn btn-danger" onClick={()=>deleteAccount()}>
            <i className="fa fa-user-minus"></i>
            Delete My Account
          </button>
        </div>
      </Fragment> : 
      <Fragment>
        <p>You have to set up the profile ! please add some info </p>
        <Link to="/create-profile" className="btn btn-primary my-1">
          Create Profile
        </Link>
      </Fragment>}
  </Fragment>
  );
}

Dashboard.propTypes = {

  getCurrentProfile:PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired,
  profile:PropTypes.object.isRequired,
  deleteAccount:PropTypes.func.isRequired,
}

const mapStateToProps =state=>({
  auth:state.auth,
  profile:state.profile
})

export default connect(mapStateToProps,{ getCurrentProfile , deleteAccount })(Dashboard)
