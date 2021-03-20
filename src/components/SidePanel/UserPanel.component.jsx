import React from 'react';
import firebase from '../../firebase/firebase.utils';
import AvatarEditor from 'react-avatar-editor';

import { Button, Dropdown, Grid, Header, Icon, Image, Input, Modal } from 'semantic-ui-react';

class UserPanel extends React.Component {
	state = {
		user: this.props.currentUser,
		modal: false,
		previewImage: '',
		croppedImage: '',
		uploadedCroppedImage: '',
		blob: '',
		storageRef: firebase.storage().ref(),
		userRef: firebase.auth().currentUser,
		usersRef: firebase.database().ref('users'),
		metadata: {
			contentType: 'image/jpeg',
		},
	};

	openModal = () => this.setState({ modal: true });

	closeModal = () => this.setState({ modal: false });

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
			{ key: 'avatar', text: <span onClick={this.openModal}>Change Avatar</span> },

			{
				key: 'signout',
				text: <span onClick={this.handleSignOut}>Sign Out</span>,
			},
		];
	}

	handleChange = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		if (file) {
			reader.readAsDataURL(file);
			reader.addEventListener('load', () => {
				this.setState({ previewImage: reader.result });
			});
		}
	};

	handleCropImage = () => {
		if (this.avatartEditor) {
			this.avatartEditor.getImageScaledToCanvas().toBlob((blob) => {
				let imageUrl = URL.createObjectURL(blob);
				this.setState({
					croppedImage: imageUrl,
					blob,
				});
			});
		}
	};

	uploadCropImage = () => {
		const { storageRef, userRef, blob, metadata } = this.state;

		storageRef
			.child(`avatars/user=${userRef.uid}`)
			.put(blob, metadata)
			.then((snap) => {
				snap.ref.getDownloadURL().then((downloadURL) =>
					this.setState(
						{
							uploadedCroppedImage: downloadURL,
						},
						() => this.changeAvatar(),
					),
				);
			});
	};

	changeAvatar = () => {
		this.state.userRef
			.updateProfile({
				photoURL: this.state.uploadedCroppedImage,
			})
			.then(() => {
				console.log('Photo updated');
				this.closeModal();
			})
			.catch((err) => {
				console.error(err);
			});
		this.state.usersRef
			.child(this.state.userRef.uid)
			.update({ avatar: this.state.uploadedCroppedImage })
			.then(() => {
				console.log('User avatar updated');
				this.closeModal();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	handleSignOut() {
		firebase
			.auth()
			.signOut()
			.then(() => console.log('SignedOut'));
	}

	render() {
		const { displayName, photoURL } = this.state.user;
		const { modal, previewImage, croppedImage } = this.state;
		const { primaryColor } = this.props;

		return (
			<Grid style={{ background: primaryColor }}>
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

					{/* {Change User Avatar Modal} */}
					<Modal basic open={modal} onClose={this.closeModal}>
						<Modal.Header>Change Avatar</Modal.Header>
						<Modal.Content>
							<Input onChange={this.handleChange} fluid type="file" label="New Avatar" name="previewImage" />
							<Grid centered stackable columns={2}>
								<Grid.Row centered>
									<Grid.Column className="ui center aligned grid">
										{/* Image Preview */}
										{previewImage && (
											<AvatarEditor
												ref={(node) => (this.avatartEditor = node)}
												image={previewImage}
												width={120}
												height={120}
												border={50}
												scale={1.2}
											/>
										)}
									</Grid.Column>
									<Grid.Column className="ui center aligned grid">
										{/* Cropped Image Preview */}
										{croppedImage && <Image style={{ margin: '3.5em auto' }} width={100} height={100} src={croppedImage} />}
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Modal.Content>

						<Modal.Actions>
							{croppedImage && (
								<Button color="green" inverted onClick={this.uploadCropImage}>
									<Icon name="save" />
									Change Avatar
								</Button>
							)}
							<Button color="green" inverted onClick={this.handleCropImage}>
								<Icon name="save" />
								Preview
							</Button>
							<Button color="red" inverted onClick={this.closeModal}>
								<Icon name="remove" />
								Cancel
							</Button>
						</Modal.Actions>
					</Modal>
				</Grid.Column>
			</Grid>
		);
	}
}

export default UserPanel;
