import React, { Component } from 'react';
import { Modal, Button, Alert, Input, message } from 'antd';
import styled from 'styled-components';
import * as firebase from 'firebase';

const FireGamesWrapper = styled.div``;

// TODO: update redux system index after adding new system to firebase

export default class AddSystem extends Component {
	static propTypes = {};

	state = {
		visible: false,
		systemName: 'null',
		error: false,
		loading: false,
	};

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleOk = () => {
		/**
		 * ADD ENTRY FOR NEW SYSTEM
		 */
		// create custom key from user system title from UI
		this.setState({
			loading: true,
		});
		if (this.state.systemName !== 'null') {
			let url = this.state.systemName
				.toString()
				.toLowerCase()
				.replace(/ /g, '');

			const addSystemAt = firebase
				.database()
				.ref('systems')
				.child(url);
			addSystemAt
				.set({
					games: 0,
					title: this.state.systemName,
					url: url,
				})
				.then(() => {
					// display success message
					this.successMessage();

					this.setState({
						visible: false,
						error: false,
						loading: false,
					});
				});
		} else {
			this.setState({
				error: true,
			});
		}
	};

	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};

	handleSystemNameInput(systemName) {
		this.setState({
			systemName,
		});
	}

	handleCloseStatusMessage() {
		this.setState({
			error: false,
			success: false,
		});
	}

	successMessage = () => {
		message.success('You successfully added a new System to your collection! 👾', 3);
	};

	render() {
		return (
			<React.Fragment>
				<Button type="primary" icon="plus-circle-o" onClick={this.showModal}>
					Add System
				</Button>
				<Modal
					title="Add a new System to your Collection 👾"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText="ADD"
					cancelText="CANCEL"
					confirmLoading={this.state.loading}
				>
					<Input onChange={e => this.handleSystemNameInput(e.target.value)} placeholder="System Name" />
					{this.state.error && (
						<Alert
							message="Something is missing 🤔"
							description="Please check your input. Do you added a System Name?"
							type="error"
							closable
							onClose={() => this.handleCloseStatusMessage()}
							showIcon
						/>
					)}
				</Modal>
			</React.Fragment>
		);
	}
}
