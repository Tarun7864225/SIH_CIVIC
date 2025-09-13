"use client";

import { Loader } from "@/components/loader";
import React, { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
        <Loader/>
    );
  }

  return <>{children}</>;
};

export default Layout;
