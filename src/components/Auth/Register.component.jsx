import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase/firebase.utils';
import md5 from 'md5';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			errors: [],
			isLoading: false,
			userRef: firebase.database().ref('users'),
		};
	}

	isFormValid() {
		let errors = [];
		let error;
		if (this.isFormEmpty(this.state)) {
			error = { message: 'Fill in all the fields' };
			this.setState({
				errors: errors.concat(error),
			});
			return false;
		}
		if (!this.isPasswordValid(this.state)) {
			error = { message: 'Password is invalid' };
			this.setState({
				errors: errors.concat(error),
			});
			return false;
		} else {
			return true;
		}
	}

	isFormEmpty({ username, email, password, confirmPassword }) {
		return !username.length || !email.length || !password.length || !confirmPassword.length;
	}

	isPasswordValid({ password, confirmPassword }) {
		if (password < 6 || confirmPassword < 6) {
			return false;
		} else if (password !== confirmPassword) {
			return false;
		} else {
			return true;
		}
	}
	displayErrors = (errors) => {
		return errors.map((error, idx) => {
			return <p key={idx}>{error.message}</p>;
		});
	};
	handleChange = (event) => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		if (this.isFormValid()) {
			this.setState({
				errors: [],
				isLoading: true,
			});
			firebase
				.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then((createdUser) => {
					console.log(createdUser);
					createdUser.user
						.updateProfile({
							displayName: this.state.username,
							photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
						})
						.then(() => {
							this.saveUser(createdUser).then(() => {
								console.log('Users Saved');
								this.setState({
									isLoading: false,
								});
							});
						})
						.catch((err) => {
							console.log(err);
							this.setState({
								errors: this.state.errors.concat(err),
								isLoading: false,
							});
						});
				})
				.catch((err) => {
					console.log(err);
					this.setState({
						errors: this.state.errors.concat(err),
						isLoading: false,
					});
				});
		}
	};
	saveUser = (createdUser) => {
		return this.state.userRef.child(createdUser.user.uid).set({
			name: createdUser.user.displayName,
			email: createdUser.user.email,
			avatar: createdUser.user.photoURL,
		});
	};

	handleInputError = (errors, inputName) => {
		return errors.some((error) => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
	};

	render() {
		const { username, email, password, confirmPassword, errors, isLoading } = this.state;
		return (
			<Grid textAlign="center" verticalAlign="middle" className="app">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h1" icon color="violet" textAlign="center">
						<Icon name="chat" color="violet" />
						Sign up for ChitChat
					</Header>
					<Form onSubmit={this.handleSubmit} size="large" autoComplete="off">
						<Segment stacked>
							<Form.Input
								fluid
								name="username"
								icon="user"
								iconPosition="left"
								placeholder="Username"
								value={username}
								onChange={this.handleChange}
								type="text"
							/>
							<Form.Input
								fluid
								name="email"
								icon="mail"
								iconPosition="left"
								placeholder="Email"
								value={email}
								onChange={this.handleChange}
								className={this.handleInputError(errors, 'email')}
								type="email"
							/>
							<Form.Input
								fluid
								name="password"
								icon="lock"
								iconPosition="left"
								placeholder="Password"
								value={password}
								onChange={this.handleChange}
								className={this.handleInputError(errors, 'password')}
								type="password"
							/>
							<Form.Input
								fluid
								name="confirmPassword"
								icon="repeat"
								iconPosition="left"
								placeholder="Confirm Password"
								value={confirmPassword}
								onChange={this.handleChange}
								className={this.handleInputError(errors, 'password')}
								type="password"
							/>
							<Button disabled={isLoading} className={isLoading ? 'loading' : ''} color="violet" fluid size="large">
								Sign up
							</Button>
						</Segment>
					</Form>
					{errors.length > 0 && (
						<Message error>
							<h3>Error</h3>
							{this.displayErrors(errors)}
						</Message>
					)}

					<Message>
						Already a user? <Link to="/login">Sign in</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Register;
