import React from 'react';
import firebase from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../redux/channel/channel.actions';

import { Icon, Menu, Modal, Form, Button, Input, Label } from 'semantic-ui-react';

class Channels extends React.Component {
	state = {
		activeChannel: '',
		user: this.props.currentUser,
		channel: null,
		channels: [],
		channelName: '',
		channelDetails: '',
		channelRef: firebase.database().ref('channels'),
		messagesRef: firebase.database().ref('messages'),
		notifications: [],
		modal: false,
		firstLoad: true,
	};

	componentDidMount() {
		this.addListeners();
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	addListeners = () => {
		let loadedChannels = [];

		this.state.channelRef.on('child_added', (snap) => {
			loadedChannels.push(snap.val());
			this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
			this.addNotificationListener(snap.key);
		});
	};

	addNotificationListener = (channelId) => {
		this.state.messagesRef.child(channelId).on('value', (snap) => {
			if (this.state.channel) {
				this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
			}
		});
	};

	handleNotifications = (channelId, currentChannelId, notifications, snap) => {
		let lastTotal = 0;
		let index = notifications.findIndex((notification) => notification.id === channelId);
		if (index !== -1) {
			if (channelId !== currentChannelId) {
				lastTotal = notifications[index].total;

				if (snap.numChildren() - lastTotal > 0) {
					notifications[index].count = snap.numChildren() - lastTotal;
				}
			}
			notifications[index].lastKnownTotal = snap.numChildren();
		} else {
			notifications.push({
				id: channelId,
				total: snap.numChildren(),
				lastKnownTotal: snap.numChildren(),
				count: 0,
			});
		}

		this.setState({ notifications });
	};

	removeListeners = () => {
		this.state.channelRef.off();
	};

	setFirstChannel = () => {
		const firstChannel = this.state.channels[0];

		if (this.state.firstLoad && this.state.channels.length > 0) {
			this.props.setCurrentChannel(firstChannel);
			this.setActiveChannel(firstChannel);
			this.setState({ channel: firstChannel });
		}

		this.setState({ firstLoad: false });
	};

	addChannel = () => {
		const { channelRef, channelName, channelDetails, user } = this.state;

		const key = channelRef.push().key;

		const newChannel = {
			id: key,
			name: channelName,
			details: channelDetails,
			createdBy: {
				name: user.displayName,
				avatar: user.photoURL,
			},
		};

		channelRef
			.child(key)
			.update(newChannel)
			.then(() => {
				this.setState({ channelName: '', channelDetails: '' });
				this.closeModal();
				console.log('channel updated');
			})
			.catch((err) => {
				console.log('err');
			});
	};

	changeChannel = (channel) => {
		this.setActiveChannel(channel);
		this.clearNotifications();
		this.props.setCurrentChannel(channel);
		this.props.setPrivateChannel(false);
		this.setState({
			channel,
		});
	};

	clearNotifications = () => {
		let index = this.state.notifications.findIndex((notification) => notification.id === this.state.channel.id);

		if (index !== -1) {
			let updatedNotifications = [...this.state.notifications];
			updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
			updatedNotifications[index].count = 0;
			this.setState({ notifications: updatedNotifications });
		}
	};

	setActiveChannel = (channel) => {
		this.setState({ activeChannel: channel.id });
	};

	getNotificationCount = (channel) => {
		let count = 0;

		this.state.notifications.forEach((notification) => {
			if (notification.id === channel.id) {
				count = notification.count;
			}
		});

		if (count > 0) return count;
	};

	displayChannels = (channels) =>
		channels.length > 0 &&
		channels.map((channel) => (
			<Menu.Item
				key={channel.id}
				name={channel.name}
				style={{ opacity: 0.7 }}
				active={channel.id === this.state.activeChannel}
				onClick={() => this.changeChannel(channel)}
			>
				{this.getNotificationCount(channel) && <Label color="red">{this.getNotificationCount(channel)}</Label>}# {channel.name}
			</Menu.Item>
		));

	handleSubmit = (event) => {
		event.preventDefault();

		if (this.isFormValid(this.state)) {
			this.addChannel();
		}
	};

	isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

	openModal = () =>
		this.setState({
			modal: true,
		});

	closeModal = () =>
		this.setState({
			modal: false,
		});

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const { channels, modal } = this.state;

		return (
			<>
				<Menu.Menu className="menu">
					<Menu.Item>
						<span>
							<Icon name="list" />
							&nbsp;&nbsp;CHANNELS
						</span>
						( {channels.length}
						)
						<Icon name="add" onClick={this.openModal} />
					</Menu.Item>

					{/* Channels */}
					{this.displayChannels(channels)}
				</Menu.Menu>

				{/* Add Channels Modal */}
				<Modal basic open={modal} onClose={this.closeModal}>
					<Modal.Header>Add a channel</Modal.Header>
					<Modal.Content>
						<Form>
							<Form.Field>
								<Input fluid label="Name of Channel" name="channelName" onChange={this.handleChange} />
							</Form.Field>
							<Form.Field>
								<Input fluid label="About the Channel" name="channelDetails" onChange={this.handleChange} />
							</Form.Field>
						</Form>
					</Modal.Content>

					<Modal.Actions>
						<Button color="green" onClick={this.handleSubmit} inverted>
							<Icon name="checkmark" />
							Add
						</Button>
						<Button color="red" inverted onClick={this.closeModal}>
							<Icon name="remove" />
							Close
						</Button>
					</Modal.Actions>
				</Modal>
			</>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	setCurrentChannel: (channel) => dispatch(setCurrentChannel(channel)),
	setPrivateChannel: (channel) => dispatch(setPrivateChannel(channel)),
});

export default connect(null, mapDispatchToProps)(Channels);
