/* eslint-disable no-useless-return */
import debounce from 'just-debounce-it'
import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'

// https://www.omdbapi.com/?apikey=b0d9b793&s=Avengers

function App() {
	const [sort, setSort] = useState(false)
	const { search, updateSearch, error } = useSearch()
	const { movies, getMovies, loading } = useMovies({ search, sort })

	function useSearch() {
		const [search, updateSearch] = useState('')
		const [error, setError] = useState(null)
		const isFirstInput = useRef(true)

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

	const debouncedGetMovies = useCallback(
		debounce((search) => {
			getMovies({ search })
		}, 300),
		[]
	)

	const handleSubmit = (event) => {
		event.preventDefault()
		getMovies({ search })
		// const { query } = Object.fromEntries(new window.FormData(event.target))
	}

	const handleChange = (event) => {
		const newSearch = event.target.value
		updateSearch(newSearch)
		debouncedGetMovies(newSearch)
	}

	const handleSort = () => {
		setSort(!sort)
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
						name='query'
						placeholder='Search your movie...'
					/>
					<input type='checkbox' onChange={handleSort} checked={sort} />
					<button type='submit'>Search</button>
				</form>
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</header>

			<main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
		</div>
	)
}

export default App
