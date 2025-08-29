"use client";
import React, { useState } from "react";
import css from "./sign-upPage.module.css";
import {
  AxiosErrorResponse,
  register,
  RegisterRequest,
} from "../../../lib/api/clientApi";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuthStore } from "../../../lib/store/authStore";

export default function SignUp() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const handleSignUp = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as RegisterRequest;
      const res = await register(formValues);
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
        <h1 className={css.formTitle}>Sign up</h1>
        <form action={handleSignUp} className={css.form}>
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
              Register
            </button>
          </div>
        </form>
        {error && <p className={css.error}> {error}</p>}
      </main>
    </div>
  );
}
