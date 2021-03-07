import React from 'react';
import firebase from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../redux/channel/channel.actions';

import { Icon, Menu, Modal, Form, Button, Input } from 'semantic-ui-react';

class Channels extends React.Component {
	state = {
		activeChannel: '',
		user: this.props.currentUser,
		channels: [],
		channelName: '',
		channelDetails: '',
		channelRef: firebase.database().ref('channels'),
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
		});
	};

	removeListeners = () => {
		this.state.channelRef.off();
	};

	setFirstChannel = () => {
		const firstChannel = this.state.channels[0];

		if (this.state.firstLoad && this.state.channels.length > 0) {
			this.props.setCurrentChannel(firstChannel);
			this.setActiveChannel(firstChannel);
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
		this.props.setCurrentChannel(channel);
	};

	setActiveChannel = (channel) => {
		this.setState({ activeChannel: channel.id });
	};

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
		const { channels, modal, activeChannel } = this.state;

		return (
			<>
				<Menu.Menu
					style={{
						paddingBottom: '2em',
					}}
				>
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
					{channels.length > 0 &&
						channels.map((channel) => (
							<Menu.Item
								key={channel.id}
								name={channel.name}
								style={{ opacity: 0.7 }}
								active={channel.id === activeChannel}
								onClick={() => this.changeChannel(channel)}
							>
								# {channel.name}
							</Menu.Item>
						))}
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
});

export default connect(null, mapDispatchToProps)(Channels);
