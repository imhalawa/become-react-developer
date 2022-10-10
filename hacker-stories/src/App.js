import React, { useEffect } from 'react';
import './App.css';

const App = () => {
	const stories = [
		{
			title: 'React',
			url: 'https://reactjs.org/',
			author: 'Jordan Walke',
			num_comments: 3,
			points: 4,
			objectID: 0,
		},
		{
			title: 'Redux',
			url: 'https://redux.js.org/',
			author: 'Dan Abramov, Andrew Clark',
			num_comments: 2,
			points: 5,
			objectID: 1,
		},
	];

	// moved the state from Search Component to App, i.e. Lifting Up the State
	const [searchTerm, setSearchTerm] = useSemiPersistentState('search','React');
	const searchResult = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleSearch = event => {
		setSearchTerm(event.target.value);
	}

	return (
		<>
			<h1>My Hacker Stories</h1>
			<Search onSearch={handleSearch} searchTerm={searchTerm} />
			<hr />
			<List items={searchResult} />
		</>
	);
}

const List = ({ items }) =>
	// Extract objectId on it's Own, Leave the Rest of properties only on Item --> Rest Operator
	items.map((item) => <ListItem key={item.objectID} item={item} />);

const ListItem = ({ item }) => (
	<React.Fragment>
		<span>
			<a href={item.url}>{item.title}</a>
		</span>
		<span>{item.author}</span>
		<span>{item.num_comments}</span>
		<span>{item.points}</span>
	</React.Fragment>
);

const Search = ({ searchTerm, onSearch }) => {
	return (
		<>
			<label htmlFor="search">Search: </label>
			<input id="search" type="text" value={searchTerm} onChange={onSearch} />

			<p>
				Searching for <strong>{searchTerm}</strong>
			</p>
		</>
	);
}

// Wrapping around the useState and useEffect!
const useSemiPersistentState = (key, initialState) => {
	// define the state
	const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

	// setup useEffect
	React.useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);

	return [value, setValue];
}

export default App;