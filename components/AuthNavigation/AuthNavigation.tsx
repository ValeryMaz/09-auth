"use client";
import React, { useEffect, useState } from "react";
import css from "./AuthNavigation.module.css";
import Link from "next/link";
import { getMe, logout } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";
import { useRouter } from "next/navigation";
import { User } from "../../types/user";

export default function AuthNavigation() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getMe().then((user) => {
      setUser(user);
    });
  }, []);

  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.push("/sign-in");
  };

  return isAuthenticated ? (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button onClick={handleLogout} className={css.logoutButton}>
          Logout
        </button>
      </li>
    </>
  ) : (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
