import { Note, NewNoteAddData } from "../../types/note";
import { nextServer } from "./api";
import { cookies } from "next/headers";
import { User } from "../../types/user";
import { UpdateUserRequest } from "./clientApi";

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

  const cookieStore = await cookies();
  const headers = {
    Cookie: cookieStore.toString(),
  };

  const response = await nextServer.get<NoteType>("/notes", {
    params: {
      page,
      perPage,
      ...(search.trim() && { search: search.trim() }),
      ...(tag && { tag }),
    },
    headers,
  });
  // console.log(response.data);
  return response.data;
}

export async function addNote(noteData: NewNoteAddData): Promise<Note> {
  const response = await nextServer.post<Note>("/notes", noteData);
  return response.data;
}

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const response = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
export const updateMe = async (data: UpdateUserRequest) => {
  const cookieStore = await cookies();
  const response = await nextServer.put<User>("/users/me", data, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  // console.log(response.data);
  return response.data;
}
