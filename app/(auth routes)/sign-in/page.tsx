"use client";
import React, { useState } from "react";
import css from "./sign-inPage.module.css";
import { useRouter } from "next/navigation";
import { AxiosErrorResponse, login } from "../../../lib/api/clientApi";
import { AxiosError } from "axios";
import { useAuthStore } from "../../../lib/store/authStore";

type LoginRequest = {
  email: string;
  password: string;
};

export default function SingIn() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as LoginRequest;
      const res = await login(formValues);
      if (res) {
        setUser(res);
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
  return (
    <div>
      <main className={css.mainContent}>
        <form action={handleSignIn} className={css.form}>
          <h1 className={css.formTitle}>Sign in</h1>

          <div className={css.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className={css.input}
              required
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={css.input}
              required
            />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.submitButton}>
              Log in
            </button>
          </div>

          {/* <p className={css.error}>{error}</p> */}
          {error && <p>{error}</p>}
        </form>
      </main>
    </div>
  );
}
