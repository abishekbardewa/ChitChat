import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase/firebase.utils';

import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			errors: [],
			isLoading: false,
		};
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
		const isValid = this.isFormValid(this.state);
		if (isValid) {
			this.setState({
				errors: [],
				isLoading: true,
			});
			firebase
				.auth()
				.signInWithEmailAndPassword(this.state.email, this.state.password)
				.then((signedInUser) => {
					console.log(signedInUser);
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
	isFormValid = ({ email, password }) => {
		let errors = [];
		let error;
		if (!email.length || !password.length) {
			error = { message: 'Fill in all the fields' };
			this.setState({
				errors: errors.concat(error),
			});
			return false;
		}
		return true;
	};

	handleInputError = (errors, inputName) => {
		return errors.some((error) => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
	};

	render() {
		const { email, password, errors, isLoading } = this.state;
		return (
			<Grid textAlign="center" verticalAlign="middle" className="app">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h1" icon color="purple" textAlign="center">
						<Icon name="code branch" color="purple" />
						Login for ChitChat
					</Header>
					<Form onSubmit={this.handleSubmit} size="large" autoComplete="off">
						<Segment stacked>
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
							<Button disabled={isLoading} className={isLoading ? 'loading' : ''} color="purple" fluid size="large">
								Submit
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
						Don't have an account? <Link to="/register">Login</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Login;
