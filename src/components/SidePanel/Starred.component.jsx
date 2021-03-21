import React from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../redux/channel/channel.actions';

import firebase from '../../firebase/firebase.utils';

import { Icon, Menu } from 'semantic-ui-react';

class Starred extends React.Component {
	state = {
		user: this.props.currentUser,
		usersRef: firebase.database().ref('users'),
		activeChannel: '',
		starredChannels: [],
	};

	componentDidMount() {
		if (this.state.user) {
			this.addListeners(this.state.user.uid);
		}
	}

	componentWillUnmount() {
		this.removeListener();
	}

	removeListener = () => {
		this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
	};

	addListeners = (userId) => {
		this.state.usersRef
			.child(userId)
			.child('starred')
			.on('child_added', (snap) => {
				const starredChannel = { id: snap.key, ...snap.val() };
				this.setState({
					starredChannels: [...this.state.starredChannels, starredChannel],
				});
			});

		this.state.usersRef
			.child(userId)
			.child('starred')
			.on('child_removed', (snap) => {
				const channelToRemove = { id: snap.key, ...snap.val() };
				const filteredChannels = this.state.starredChannels.filter((channel) => {
					return channel.id !== channelToRemove.id;
				});
				this.setState({
					starredChannels: filteredChannels,
				});
			});
	};

	setActiveChannel = (channel) => {
		this.setState({ activeChannel: channel.id });
	};

	changeChannel = (channel) => {
		this.setActiveChannel(channel);
		this.props.setCurrentChannel(channel);
		this.props.setPrivateChannel(false);
	};

	displayChannels = (starredChannels) =>
		starredChannels.length > 0 &&
		starredChannels.map((channel) => (
			<Menu.Item
				key={channel.id}
				name={channel.name}
				style={{ opacity: 0.7 }}
				active={channel.id === this.state.activeChannel}
				onClick={() => this.changeChannel(channel)}
			>
				# {channel.name}
			</Menu.Item>
		));

	render() {
		const { starredChannels } = this.state;
		return (
			<Menu.Menu className="menu">
				<Menu.Item>
					<span>
						<Icon name="star" />
						&nbsp;&nbsp;STARRED
					</span>
					( {starredChannels.length})
				</Menu.Item>

				{/* Channels */}
				{this.displayChannels(starredChannels)}
			</Menu.Menu>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	setCurrentChannel: (channel) => dispatch(setCurrentChannel(channel)),
	setPrivateChannel: (channel) => dispatch(setPrivateChannel(channel)),
});

export default connect(null, mapDispatchToProps)(Starred);
