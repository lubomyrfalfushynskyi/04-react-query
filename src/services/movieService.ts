import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!TMDB_TOKEN) {
    console.error('TMDB API token is not set. Please add VITE_TMDB_TOKEN to your .env file.');
}

interface MovieSearchResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export const getImageUrl = (path:string | null, size: string = 'w500'): string => {
    if (!path){
        return '';
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchMovies = async (query: string, page: number = 1): Promise<MovieSearchResponse> => {
    if (!TMDB_TOKEN) {
        throw new Error('TMDB API token is missing. Cannot fetch movies.');
    }
    try{
        const response = await axios.get<MovieSearchResponse>(`${BASE_URL}/search/movie`,
            {
                params: {
                    query:query,
                    page: page,
                    language: 'uk-UA',
                },
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                },
            }
        );
        return response.data;
    }
    catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
    }    
};
