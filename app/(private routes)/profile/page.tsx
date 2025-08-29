import React from "react";
import css from "../profile/ProfilePage.module.css";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServerMe } from "../../../lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile",
  description: "Now you will see your Profile",
  openGraph: {
    title: "Profile",
    description: "Now you will see your Profile",
  },
};

export default async function ProfilePage() {
  const user = await getServerMe();
  return (
    <div>
      <main className={css.mainContent}>
        {/* <h1 className={css.formTitle}>Profile Page</h1> */}
        <div className={css.profileCard}>
          <div className={css.avatarWrapper}>
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.header}>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>
          <div>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
