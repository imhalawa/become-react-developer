import React from 'react';
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
	const [searchTerm, setSearchTerm] = React.useState('');
	const searchResult = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleSearch = event => {
		setSearchTerm(event.target.value);
	}

	return (
		<div>
			<h1>My Hacker Stories</h1>
			<Search onSearch={handleSearch} searchTerm={searchTerm} />
			<hr />
			<List items={searchResult} />
		</div>
	);
}

const List = (props) =>
	props.items.map(item => (
		<div key={item.objectID}>
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
		</div>
	));

const Search = (props) => {

	const handleChange = event => {
		// call the callback function provided by the Search component parent
		props.onSearch(event);
	}

	return (
		<div>
			<label htmlFor="search">Search: </label>
			<input id="search" type="text" onChange={handleChange} />

			<p>
				Searching for <strong>{props.searchTerm}</strong>
			</p>
		</div>
	);
}

export default App;