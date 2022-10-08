import './App.css';

class Developer {
	constructor(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	}

	get fullName() {
		return this.firstName + ' ' + this.lastName;
	}
}


function App() {
	return (
		<div>
			<h1>My Hacker Stories</h1>

			<label htmlFor="search">Search: </label>
			<input id="search" type="text" />
			<hr />
			<List />
			<List />
		</div>
	);
}

function List() {
	const robin = new Developer('Robin', 'Wieruch');
	const dennis = new Developer('Dennis', 'Wieruch');

	return (
		<div>
			{robin.fullName}
			{dennis.fullName}
		</div>
	)
}

export default App;