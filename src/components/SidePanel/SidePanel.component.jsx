import React from 'react';
import { Menu } from 'semantic-ui-react';
import Channels from './Channels.component';
import DirectMessages from './DirectMessages.component';
import UserPanel from './UserPanel.component';
import Starred from './Starred.component';

class SidePanel extends React.Component {
	render() {
		const { currentUser, primaryColor } = this.props;
		return (
			<Menu size="large" inverted fixed="left" vertical style={{ background: primaryColor, fontSize: '1.2rem' }}>
				<UserPanel primaryColor={primaryColor} currentUser={currentUser} />
				<Starred currentUser={currentUser} />
				<Channels currentUser={currentUser} />
				<DirectMessages currentUser={currentUser} />
			</Menu>
		);
	}
}

export default SidePanel;
