import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './App.module.css';
import cs from 'classnames'
import {ReactComponent as Check} from './check.svg';


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



	const handleRemoveStory = item => {
		dispatchStories({ type: 'REMOVE_STORY', payload: item });
	}

	const handleFetchStories = React.useCallback(async () => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });
		try {
			const result = await axios.get(searchUrl);
			dispatchStories({ type: "STORIES_FETCH_SUCCESS", payload: result.data.hits });
		} catch {
			dispatchStories({ type: 'STORIES_FETCH_ERROR' });
		}
	}, [searchUrl])

	const handleSearchTerm = event => {
		setSearchTerm(event.target.value);
	}

	const handleSearchSubmit = (event) => {
		setSearchUrl(`${API_ENDPOINT}${searchTerm}`);
		event.preventDefault();
	}

	useEffect(() => { handleFetchStories(); }, [handleFetchStories]);

	return (
		<div className={styles.container}>
			<h1 className={styles.headlinePrimary}>My Hacker Stories</h1>

			<SearchForm onSearchInput={handleSearchTerm} onSubmit={handleSearchSubmit} searchTerm={searchTerm}
				className={styles['button_large']}
			/>

			{stories.isError && <p>Something went wrong ...</p>}
			{stories.isLoading ? (<p>Loading ... </p>) : (<List items={stories.data} onRemoveItem={handleRemoveStory} />)}
		</div>
	);
}

const List = ({ items, onRemoveItem }) =>
	// Extract objectId on it's Own, Leave the Rest of properties only on Item --> Rest Operator
	items.map((item) => <ListItem key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);

const ListItem = ({ item, onRemoveItem }) => (
	<div className={styles.item}>
		<span style={{ width: '40%' }}>
			<a href={item.url}>{item.title}</a>
		</span>
		<span style={{ width: '30%' }}>{item.author}</span>
		<span style={{ width: '10%' }}>{item.num_comments}</span>
		<span style={{ width: '10%' }}>{item.points}</span>
		<span style={{ width: '10%' }}>
			<button type="button" className={cs(styles.button,styles.button_small)} onClick={() => { onRemoveItem(item) }}>
				<Check height="18px" width="18px"/>
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
			<label htmlFor={id} className={styles.label}>{children} </label>
			<input
				id={id}
				type={type}
				value={value}
				onChange={onChange}
				ref={inputRef}
				className={styles.input}

			/>
		</React.Fragment>
	);
}

const SearchForm = ({ onSearchTermChanged, onSubmit, searchTerm, className }) => {

	return (
		<form onSubmit={(event => onSubmit(event))} className={styles['search-form']}>
			<InputWithLabel id="search" onChange={(event) => onSearchTermChanged(event)} value={searchTerm} >
				<strong>Search: </strong>
			</InputWithLabel>

			<button type="submit" disabled={!searchTerm} className={cs(styles.button,className)} >
				Submit
			</button>
		</form>
	);
}


export default App;