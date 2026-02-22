import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
    baseURL: BASE_URL,
    headers:{
        Authorization: `Bearer ${TOKEN}`,
    },
});

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (page: number = 1, perPage: number = 12, search: string = ''): Promise<FetchNotesResponse> => {
    const res = await api.get<FetchNotesResponse>('/notes', {
        params: { page, perPage, search },
    });
    return res.data;
};

export const createNote = async (note: {title: string; content: string; tag: string }): Promise<Note> => {
    const res = await api.post<Note>('/notes', note);
    return res.data;
};

export const deleteNote = async (id:string): Promise<Note> => {
    const res = await api.delete<Note>(`/notes/${id}`);
    return res.data;
}
