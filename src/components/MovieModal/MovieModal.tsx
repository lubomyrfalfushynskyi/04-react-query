import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from '../../types/movie';
import { getImageUrl } from "../../services/movieService";

import styles from './MovieModal.module.css';

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

const getModalRoot = (): HTMLElement => {
    let modalRoot = document.querySelector('#modal-root');
    
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'modal-root');
        document.body.appendChild(modalRoot);
    }
    
    return modalRoot as HTMLElement;
};

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const backdropImageUrl = getImageUrl(movie.backdrop_path, 'original');
    const posterImageUrl = getImageUrl(movie.poster_path);

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                    &times;
                </button>
                <img
                    src={backdropImageUrl || posterImageUrl}
                    alt={movie.title}
                    className={styles.image}
                />
                <div className={styles.content}>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p>
                        <strong>Release Date:</strong> {movie.release_date}
                    </p>
                    <p>
                        <strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average}/10` : 'N/A'}
                    </p>
                </div>
            </div>
        </div>,
        getModalRoot()
    );
};

export default MovieModal;
