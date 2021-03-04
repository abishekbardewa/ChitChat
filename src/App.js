import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { auth } from './firebase/firebase.utils';
import Register from './components/Auth/Register.component';
import Login from './components/Auth/Login.component';
import Chat from './components/Chat/Chat.component';
import { setCurrentUser, clearUser } from './redux/user/user.actions';
import Spinner from './components/Spinner/Spinner';

import './App.css';

class App extends React.Component {
	componentDidMount() {
		// console.log(this.props.isLoading);
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.props.setCurrentUser(user);
				this.props.history.push('/');
			} else {
				this.props.history.push('/login');
				this.props.clearUser();
			}
		});
	}
	render() {
		return this.props.isLoading ? (
			<Spinner />
		) : (
			<Switch>
				<Route exact path="/" component={Chat} />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
			</Switch>
		);
	}
}
const mapStateToProps = (state) => {
	// console.log('Maps', state);
	return {
		isLoading: state.user.isLoading,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		setCurrentUser: (user) => dispatch(setCurrentUser(user)),
		clearUser: () => dispatch(clearUser()),
	};
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
