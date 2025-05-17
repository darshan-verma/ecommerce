"use client";
import Login from "@/components/admin-panel/Login";
import Loader from "@/components/admin-panel/Loader";
import { useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import React from "react";
import Sidebar from "@/components/admin-panel/Sidebar";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isLoading = useAppSelector((state) => state.loadingReducer);
  const { data: session } = useSession();

  if (!session?.user) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto px-4 py-6">
            <ToastProvider>
              {children}
              {isLoading && <Loader />}
            </ToastProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
