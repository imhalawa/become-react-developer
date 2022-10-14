import React, { useEffect, useState } from 'react';
import './App.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

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

// Reducer function
// State is passed by the useReducer Hook
const storiesReducer = (state, action) => {
	switch (action.type) {
		case 'STORIES_FETCH_INIT':
			return {
				...state,
				isLoading: true,
				isError: false
			};
		case 'STORIES_FETCH_SUCCESS':
			return {
				...state,
				data: action.payload,
				isLoading: false,
				isError: false
			};
		case 'STORIES_FETCH_ERROR':
			return {
				...state,
				isLoading: false,
				isError: true
			};
		case 'REMOVE_STORY':
			return {
				...state,
				data: state.data.filter(story => story.objectID !== action.payload.objectID)
			};
		default:
			throw new Error("Unknown Action");
	}
}


const App = () => {
	const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
	const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
	const [searchUrl, setSearchUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

	const handleSearch = event => {
		setSearchTerm(event.target.value);
	}

	const handleRemoveStory = item => {
		dispatchStories({ type: 'REMOVE_STORY', payload: item });
	}

	const handleFetchStories = React.useCallback(() => {
		if (!searchTerm) return;

		dispatchStories({ type: "STORIES_FETCH_INIT" });

		fetch(searchUrl)
			.then(response => response.json())
			.then(result => {
				dispatchStories({ type: "STORIES_FETCH_SUCCESS", payload: result.hits })
			})
			.catch(() => {
				dispatchStories({ type: 'STORIES_FETCH_ERROR' })
			});
	}, [searchUrl])

	const handleSearchSubmit = () => {
		setSearchUrl(`${API_ENDPOINT}${searchTerm}`);
	}

	useEffect(() => { handleFetchStories(); }, [handleFetchStories]);

	return (
		<>
			<h1>My Hacker Stories</h1>
			<InputWithLabel id="search" isFocused onChange={handleSearch} value={searchTerm} >
				<strong>Search: </strong>
			</InputWithLabel>

			<button
				type="button"
				disabled={!searchTerm}
				onClick={handleSearchSubmit}
			>
				Submit
			</button>

			<hr />
			{stories.isError && <p>Something went wrong ...</p>}
			{stories.isLoading ? (<p>Loading ... </p>) : (<List items={stories.data} onRemoveItem={handleRemoveStory} />)}
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

const SimpleText = ({ children }) => {
	return (
		<InputWithLabel>{children}</InputWithLabel>
	)
}

export default App;