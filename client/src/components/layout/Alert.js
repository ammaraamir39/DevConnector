import React from 'react'
import PropTypes from 'prop-types'
import {connect } from 'react-redux';

const Alert = ({alerts}) => alerts !== null && alerts.length > 0 && alerts.map(alert=>
  <div key={alert.id} className={`alert alert-${alert.alertType}`}>
    {alert.msg}
  </div>
)




Alert.propTypes = {
  alerts:PropTypes.array.isRequired
}

//we are mapping the redux state to a prop 
const mapStateToProps = state =>({
 //state.alert comes from the rootReducer because the previous state is in the root reducer
 //now alerts is the prop that we need 
  alerts:state.alert
})


//connect consist of initial state and actions so we pass the initial state here
export default connect(mapStateToProps)(Alert)
