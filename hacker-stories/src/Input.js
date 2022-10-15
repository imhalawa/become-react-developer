import React from "react";

class Input extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			type: this.props.value,
			value: this.props.value,
		}
	}

	render() {
		const { value, type } = this.state;

		return (
			<input type={type} value={value} onChange={(event) => {
				this.setState({ value: event.target.value, type: event.target.value }, () => {
					console.log(this.state.value);
				})
			}} />
		)
	}
}

export default Input;