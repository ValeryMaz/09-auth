"use client";

import { useEffect, useState } from "react";
import {
  AxiosErrorResponse,
  getMe,
  updateMe,
} from "../../../../lib/api/clientApi";
import css from "../edit/EditProfile.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "../../../../types/user";
import { useAuthStore } from "../../../../lib/store/authStore";
import { AxiosError } from "axios";
import AvatarPicker from "../../../../components/AvatarPicker/AvatarPicker";

export default function EditProfile() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const setUserUpdate = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  // const user = useAuthStore();
  useEffect(() => {
    getMe().then((user) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await updateMe({
        username: formData.get("username") as string,
        email: user?.email,
      });
      if (res) {
        setUserUpdate(res);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      setError(
        axiosError.response?.data?.error ??
          axiosError.message ??
          "Ooopss...some error"
      );
    }
  };

  if (!user) {
    return <p>Loading///</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form action={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user.username}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={() => router.push("/profile")}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
