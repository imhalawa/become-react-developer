import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './App.module.css';
import cs from 'classnames'
import { ReactComponent as Check } from './check.svg';


const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

type Story = {
	objectID: string;
	url: string;
	title: string;
	author: string;
	num_comments: number;
	points: number;
};

type ListItemProps = {
	item: Story;
	onRemoveItem: (item: Story) => void;
};

type SearchFormProps = {
	searchTerm: string;
	onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type Stories = Array<Story>;

type ListProps = {
	list: Stories;
	onRemoveItem: (item: Story) => void;
};

type StoriesState = {
	data: Stories;
	isLoading: boolean;
	isError: boolean;
};
type StoriesAction = StoriesFetchInitAction
	| StoriesFetchSuccessAction
	| StoriesFetchFailureAction
	| StoriesRemoveAction;

interface StoriesFetchInitAction {
	type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessAction {
	type: 'STORIES_FETCH_SUCCESS';
	payload: Stories;
}

interface StoriesFetchFailureAction {
	type: 'STORIES_FETCH_FAILURE';
}

interface StoriesRemoveAction {
	type: 'REMOVE_STORY';
	payload: Story;
}

// Wrapping around the useState and useEffect!
const useSemiPersistentState = (key: string, initialState: string): [string, (newValue: string) => void] => {

	// define the state
	const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

	// setup useEffect
	React.useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);

	return [value, setValue];
}

const getSumComments = stories => {
	console.log('C');

	return stories.data.reduce(
		(result, value) => result + value.num_comments,
		0
	);
};

// Reducer function
// State is passed by the useReducer Hook
const storiesReducer = (state: StoriesState, action: StoriesAction) => {
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
		case 'STORIES_FETCH_FAILURE':
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


	const sumComments = getSumComments(stories);
	const handleRemoveStory = (item: Story) => {
		dispatchStories({ type: 'REMOVE_STORY', payload: item });
	};

	const handleFetchStories = React.useCallback(async () => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });
		try {
			const result = await axios.get(searchUrl);
			dispatchStories({ type: "STORIES_FETCH_SUCCESS", payload: result.data.hits });
		} catch {
			dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
		}
	}, [searchUrl])

	const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	}

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		setSearchUrl(`${API_ENDPOINT}${searchTerm}`);
		event.preventDefault();
	}

	useEffect(() => { handleFetchStories(); }, [handleFetchStories]);

	return (
		<div className={styles.container}>
			<h1 className={styles.headlinePrimary}>My Hacker Stories with {sumComments} comments.</h1>

			<SearchForm onSearchInput={handleSearchTerm} onSearchSubmit={handleSearchSubmit} searchTerm={searchTerm} />

			{stories.isError && <p>Something went wrong ...</p>}
			{stories.isLoading ? (<p>Loading ... </p>) : (<List list={stories.data} onRemoveItem={handleRemoveStory} />)}
		</div>
	);
}

const List = ({ list, onRemoveItem }: ListProps) => (

	// Extract objectId on it's Own, Leave the Rest of properties only on Item --> Rest Operator
	<>
		{
			list.map((item) => <ListItem key={item.objectID} item={item} onRemoveItem={onRemoveItem} />)
		}
	</>
)

const ListItem = ({
	item,
	onRemoveItem
}: ListItemProps) => (
	<div className={styles.item}>
		<span style={{ width: '40%' }}>
			<a href={item.url}>{item.title}</a>
		</span>
		<span style={{ width: '30%' }}>{item.author}</span>
		<span style={{ width: '10%' }}>{item.num_comments}</span>
		<span style={{ width: '10%' }}>{item.points}</span>
		<span style={{ width: '10%' }}>
			<button type="button" className={cs(styles.button, styles.button_small)} onClick={() => { onRemoveItem(item) }}>
				<Check height="18px" width="18px" />
			</button>
		</span>
	</div>
);


type InputWithLabelProps = {
	id: string;
	value: string;
	type?: string;
	onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	isFocused?: boolean;
	children: React.ReactNode;
};

const InputWithLabel = ({ id, type = 'text', value, onInputChange, children, isFocused }: InputWithLabelProps) => {
	const inputRef = React.useRef<HTMLInputElement>(null);

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
				onChange={onInputChange}
				ref={inputRef}
				className={styles.input}

			/>
		</React.Fragment>
	);
}

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit, }: SearchFormProps) => {

	return (
		<form onSubmit={(event => onSearchSubmit(event))} className={styles['search-form']}>
			<InputWithLabel id="search" isFocused onInputChange={(event) => onSearchInput(event)} value={searchTerm} >
				<strong>Search: </strong>
			</InputWithLabel>

			<button type="submit" disabled={!searchTerm} className={cs(styles.button, 'button_large')} >
				Submit
			</button>
		</form>
	);
}


export default App;