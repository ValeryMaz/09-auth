import type { Note, NewNoteAddData } from "../../types/note";
import { User } from "../../types/user";
import { nextServer } from "./api";

export type AxiosErrorResponse = {
  error: string;
};

export interface NoteType {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search: string,
  tag: string
): Promise<NoteType> {
  // if (search.trim()) {
  //   params.search = query.trim();
  // }

  const response = await nextServer.get<NoteType>("/notes", {
    params: {
      page,
      perPage,
      ...(search.trim() && { search: search.trim() }),
      ...(tag && { tag }),
    },
    //   headers: {
    //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    //   },
  });
  // console.log(response.data);
  return response.data;
}

export type LoginRegister = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  username?: string;
  email?: string;
  formData?: FormData;
};

type CheckSessionProps = {
  success: boolean;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRegister) => {
  const response = await nextServer.post<User>("/auth/login", data);
  return response.data;
};

export async function addNote(noteData: NewNoteAddData): Promise<Note> {
  const response = await nextServer.post<Note>("/notes", noteData);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

export const register = async (data: RegisterRequest) => {
  const response = await nextServer.post<User>("/auth/register", data);
  return response.data;
};

export const updateMe = async (data: UpdateUserRequest) => {
  const res = await nextServer.patch<User>("/users/me", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  // console.log(response.data);
  return response.data;
}

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get("/users/me");
  return data;
};

export const checkSession = async () => {
  const response = await nextServer.get<CheckSessionProps>("/auth/session");
  return response.data.success;
};
