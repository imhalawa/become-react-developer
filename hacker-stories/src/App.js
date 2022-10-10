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
	const [searchTerm, setSearchTerm] = React.useState('React');
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

const List = ({ items }) =>
	items.map(item => <ListItem key={item.objectID} item={item} />);

const ListItem = ({
	item: {
		title,
		url,
		author,
		num_comments,
		points
	}
}) => (
	<div>
		<span>
			<a href={url}>{title}</a>
		</span>
		<span>{author}</span>
		<span>{num_comments}</span>
		<span>{points}</span>
	</div>
);


const Search = ({ searchTerm, onSearch }) => {
	return (
		<div>
			<label htmlFor="search">Search: </label>
			<input id="search" type="text" value={searchTerm} onChange={onSearch} />

			<p>
				Searching for <strong>{searchTerm}</strong>
			</p>
		</div>
	);
}

export default App;