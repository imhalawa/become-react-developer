import './App.css';

const welcome = {
	greeting: 'Hi',
	title: 'React'
}

function getTitle(title) {
	return title;
}

const daysOfWeek = [
	'Sat',
	'Sun',
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri'
]

function App() {
	return (
		<div>
			<ul>
				{
					daysOfWeek.map(day => {
						return <li>{day}</li>
					})
				}
			</ul>
		</div>
	);
}

export default App;
