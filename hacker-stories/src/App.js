import React, { useEffect } from 'react';
import './App.css';

const App = () => {
	const initialStores = [
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

	const [stories, setStories] = React.useState(initialStores);

	// moved the state from Search Component to App, i.e. Lifting Up the State
	const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
	const searchResult = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleSearch = event => {
		setSearchTerm(event.target.value);
	}

	const handleRemoveStory = item => {
		const newStories = stories.filter(story => story.objectID !== item.objectID);
		setStories(newStories);
	}

	return (
		<>
			<h1>My Hacker Stories</h1>
			<InputWithLabel id="search" isFocused onChange={handleSearch} value={searchTerm} >
				Search:
			</InputWithLabel>
			<SimpleText>
				Welcome
			</SimpleText>
			<hr />
			<List items={searchResult} onRemoveItem={handleRemoveStory} />
		</>
	);
}

const List = ({ items, onRemoveItem }) =>
	// Extract objectId on it's Own, Leave the Rest of properties only on Item --> Rest Operator
	items.map((item) => <ListItem key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);

const ListItem = ({ item, onRemoveItem }) => (
	<div>
		<span>
			<a href={item.url}>{item.title}</a>
		</span>
		<span>{item.author}</span>
		<span>{item.num_comments}</span>
		<span>{item.points}</span>
		<span>
			<button type="button" onClick={() => { onRemoveItem(item) }}>
				Dismiss
			</button>
		</span>
	</div>
);

const InputWithLabel = ({ id, type = 'text', value, onChange, children, isFocused }) => {
	const inputRef = React.useRef();

	React.useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isFocused])

	return (
		<React.Fragment>
			<label htmlFor={id}>{children} </label>
			<input
				id={id}
				type={type}
				value={value}
				onChange={onChange}
				ref={inputRef}
			/>

			<p>
				Searching for <strong>{value}</strong>
			</p>
		</React.Fragment>
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

const SimpleText = ({ children }) => {
	return (
		<InputWithLabel>{children}</InputWithLabel>
	)
}

export default App;