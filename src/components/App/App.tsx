import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

import styles from './App.module.css';

function App() {
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const {data, isLoading, isError, isSuccess, isFetching} = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: query !== '',
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (isSuccess && data && data.results.length === 0) {
            toast.error('No movies found for your request.');
        }
    }, [isSuccess, data]);

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) {
            toast.error('Please enter your search query.');
            return;
        }

        setQuery(searchQuery);
        setPage(1);
    };

    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleModalClose = () => {
        setSelectedMovie(null);
    };

    const handlePageChange = (selectedItem: {selected: number}) => {
        setPage(selectedItem.selected + 1);
    };

    return (
        <div>
            <Toaster position="top-right" />

            <SearchBar onSubmit={handleSearch} />

            {(isLoading || isFetching) && <Loader />}
            {isError && <ErrorMessage />}

            {data && data.results.length > 0 && <MovieGrid movies={data.results} onSelect={handleMovieSelect} />}

            {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleModalClose} />}
            {data && data.total_pages > 1 && (
                <ReactPaginate
                pageCount={data.total_pages}
                onPageChange={handlePageChange}
                forcePage={page - 1}
                containerClassName={styles.pagination}
                activeClassName="selected"
                previousLabel="← Prev"
                nextLabel="Next →"
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                />
            )}
        </div>
    );
}

export default App;