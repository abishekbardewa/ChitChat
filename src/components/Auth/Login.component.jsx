import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { auth } from '../../firebase/firebase.utils';

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

	displayErrors = (errors) => errors.map((error, idx) => <p key={idx}>{error.message}</p>);

	handleChange = (event) => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		const { email, password, errors } = this.state;
		const isValid = this.isFormValid(this.state);
		if (isValid) {
			this.setState({
				errors: [],
				isLoading: true,
			});
			auth
				.signInWithEmailAndPassword(email, password)
				.then((signedInUser) => {
					console.log(signedInUser);
				})
				.catch((err) => {
					console.log(err);
					this.setState({
						errors: errors.concat(err),
						isLoading: false,
					});
				});
		}
	};

	isFormValid = ({ email, password }) => {
		const errors = [];
		let error;
		if (!email.length || !password.length) {
			error = {
				message: 'Fill in all the fields',
			};
			this.setState({
				errors: errors.concat(error),
			});
			return false;
		}
		return true;
	};

	handleInputError = (errors, inputName) => (errors.some((error) => error.message.toLowerCase().includes(inputName)) ? 'error' : '');

	render() {
		const { email, password, errors, isLoading } = this.state;
		return (
			<Grid textAlign="center" verticalAlign="middle" className="app">
				<Grid.Column
					style={{
						maxWidth: 450,
					}}
				>
					<Header as="h1" icon style={{ color: '#611f69' }} textAlign="center">
						<Icon name="code branch" style={{ color: '#611f69' }} />
						Sign in to ChitChat
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
							<Button
								disabled={isLoading}
								className={isLoading ? 'loading' : ''}
								style={{ backgroundColor: '#611f69', color: '#fff' }}
								fluid
								size="large"
							>
								Sign in
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
						Don't have an account? <Link to="/register">Sign up</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Login;
