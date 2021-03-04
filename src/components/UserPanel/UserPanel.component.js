import React from 'react';
import firebase from '../../firebase/firebase.utils';

import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';

class UserPanel extends React.Component {
	state = {
		user: this.props.currentUser,
	};
	dropdownOptions() {
		return [
			{
				key: 'user',
				text: (
					<span>
						Signed in as <strong>{this.state.user.displayName}</strong>
					</span>
				),
				disabled: true,
			},
			{ key: 'avatar', text: <span>Change Avatar</span> },

			{
				key: 'signout',
				text: <span onClick={this.handleSignOut}>Sign Out</span>,
			},
		];
	}

	handleSignOut() {
		firebase
			.auth()
			.signOut()
			.then(() => console.log('SignedOut'));
	}
	render() {
		const { displayName, photoURL } = this.state.user;
		return (
			<Grid style={{ background: '#4c3c4c' }}>
				<Grid.Column>
					<Grid.Row style={{ padding: '1.2em', margin: 0 }}>
						{/* App Header */}
						<Header inverted floated="left" as="h2">
							<Icon name="code" />
							<Header.Content>ChitChat</Header.Content>
						</Header>

						{/* User Dropdown */}
						<Header style={{ padding: '0.25em' }} as="h4" inverted>
							<Dropdown
								trigger={
									<span>
										<Image src={photoURL} avatar spaced="right" />
										{displayName}
									</span>
								}
								options={this.dropdownOptions()}
							/>
						</Header>
					</Grid.Row>
				</Grid.Column>
			</Grid>
		);
	}
}

export default UserPanel;
