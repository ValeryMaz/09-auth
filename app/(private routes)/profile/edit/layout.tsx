import React from "react";

const ProfileLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <br />
      {children}
    </div>
  );
};

export default ProfileLayout;
