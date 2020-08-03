import React,{Fragment,useEffect} from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile/CreateProfile';
import EditProfile from './components/profile/EditProfile';
import AddExperiece from './components/profile/AddExperiece';
import Profiles from './components/profiles/Profiles';
import AddEducation from './components/profile/AddEducation';
import Posts from './components/Posts/Posts';
import Post from './components/post/Post';
import UserProfile from './components/singleuserProfile/Profile';
import PrivateRoute from './components/routing/PrivateRoute';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import {loadUser} from './actions/auth';
import {setAuthToken} from './utils/setAuthToken';
import './App.css';
//redux
import {Provider} from 'react-redux';
import store from './store';

//if there is a token in the local storage that means that there is already a user logged in 
if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {
  //use Effect will work as componentmount and will follow just once when the page is loaded
  //and it will load the user if there is a token present in the local storage
  useEffect(()=>{
    store.dispatch(loadUser())
  } ,[])
  
  return (
  // Switch only takes the routes so we pass the alert component outside switch
  //The <Provider /> makes the Redux store available to any nested components
  <Provider store={store}>
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Alert/>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profiles" component={Profiles} />
          <Route exact path="/profile/:id" component={UserProfile} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/create-profile" component={CreateProfile} />
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
          <PrivateRoute exact path="/add-experience" component={AddExperiece} />
          <PrivateRoute exact path="/add-education" component={AddEducation} />
          <PrivateRoute exact path="/posts" component={Posts} />
          <PrivateRoute exact path="/post/:id" component={Post} />
        </Switch> 
      </section>
    </Fragment>
  </Router>
  </Provider>
  )};
export default App;
