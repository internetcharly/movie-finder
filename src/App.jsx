/* eslint-disable no-useless-return */
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'

// https://www.omdbapi.com/?apikey=b0d9b793&s=Avengers

function App() {
	const { movies } = useMovies()
	const { search, updateSearch, error } = useSearch()
	const isFirstInput = useRef(true)

	function useSearch() {
		const [search, updateSearch] = useState('')
		const [error, setError] = useState(null)

		useEffect(() => {
			if (isFirstInput.current) {
				isFirstInput.current = search === ''
				return
			}

			if (search === '') {
				setError('Necesitas introducir una pelicula')
				return
			}

			if (search.match(/^\d+$/)) {
				setError('No se puede buscar una pelicula con un numero')
				return
			}

			if (search.length < 3) {
				setError('Necesitas introducir mas de 3 caracteres')
				return
			}

			setError(null)
		}, [search])

		return { search, updateSearch, error }
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		// const { query } = Object.fromEntries(new window.FormData(event.target))
	}

	const handleChange = (event) => {
		updateSearch(event.target.value)
	}

	return (
		<div className='page'>
			<header>
				<h1>Movie Finder</h1>
				<form className='form' onSubmit={handleSubmit}>
					<input
						style={{
							border: '1px solid transparent',
							borderColor: error ? 'red' : 'transparent',
						}}
						onChange={handleChange}
						value={search}
						name='search'
						placeholder='Search your movie...'
					/>
					<button type='submit'>Search</button>
				</form>
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</header>

			<main>
				<Movies movies={movies} />
			</main>
		</div>
	)
}

export default App
