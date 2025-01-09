'use client';

import { useSession } from "next-auth/react";
import React from "react";

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  console.log(status,"Session",session)

  if (status === "loading") {
    // While the session is being fetched, show a loading indicator
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    // Redirect to the signin page if the user is not authenticated
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
    return null; // Avoid rendering anything while redirecting
  }

  // Render children if the user is authenticated
  return <>{children}</>;
};

export default ProtectedLayout;
