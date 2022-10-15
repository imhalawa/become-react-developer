import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";
import React from "react";

class Input extends React.Component {
	constructor(props) {
		super(props);

		const {value } = this.props;
		this.inputRef = React.createRef();
		this.state = {
			type: value,
			value: value,
		}

	}

	componentDidMount() {
		if (this.props.isFocused) {
			this.inputRef.current.focus();
		}
	}

	render() {
		const { value, type } = this.state;

		return (
			<input type={type} ref={this.inputRef} value={value} onChange={(event) => {
				this.setState({ value: event.target.value, type: event.target.value }, () => {
					console.log(this.state.value);
				})
			}} />
		)
	}
}

export default Input;