import { useState } from 'react'
import withoutResults from '../mocks/no-results.json'
import withResults from '../mocks/with-results.json'

export function useMovies({ search }) {
	const [responseMovies, setResponseMovies] = useState([])

	const movies = responseMovies.Search
	const mappedMovies = movies?.map((movie) => ({
		id: movie.imdbID,
		title: movie.Title,
		year: movie.Year,
		poster: movie.Poster,
	}))

	const getMovies = () => {
		if (search) {
			fetch(`https://www.omdbapi.com/?apikey=b0d9b793&s=${search}`)
				.then((res) => res.json())
				.then((json) => {
					setResponseMovies(json)
				})
		} else {
			setResponseMovies(withoutResults)
		}
	}
	return { movies: mappedMovies, getMovies }
}
