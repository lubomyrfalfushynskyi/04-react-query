import { useState } from 'react'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';

import { useDebouncedCallback } from 'use-debounce';

import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';

import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { createNote } from '../../services/noteService';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery ({
    queryKey: ['notes', page,search],
    queryFn: () => fetchNotes(page, 12, search),
    placeholderData:keepPreviousData,
  });

  const queryClient = useQueryClient();

const deleteMutation = useMutation({
  mutationFn: deleteNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  },
});

const createMutation = useMutation({
  mutationFn: createNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setIsModalOpen(false);
  },
});

const handleCreate = (values: { title: string; content: string; tag: string }) => {
  createMutation.mutate(values);
};

const handleDelete = (id: string) => {
  deleteMutation.mutate(id);
};

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  return (
    <div className={css.app}>
        <header className={css.toolbar}>
            <SearchBox onChange={handleSearch} />
            {data && data.totalPages > 1 && (
                <Pagination
                totalPages={data.totalPages}
                currentPage={page}
                onPageChange={setPage}
                />
            )}
            <button className={css.button} onClick={() => setIsModalOpen(true)}>
                Create note +
            </button>
        </header>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
        )}

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <NoteForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
</Modal>
    </div>
);
}