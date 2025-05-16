"use client";
import Login from "@/components/admin-panel/Login";
import Loader from "@/components/admin-panel/Loader";
import { useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Sidebar from "@/components/admin-panel/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
	const isLoading = useAppSelector((state) => state.loadingReducer);
	const { data: session } = useSession();

	if (!session?.user) {
		return <Login />;
	}
	return (
		<div className="flec">
			<Sidebar/>
			<div className="w-full h-full">
				{/* <Navbar/> */}
				<div className="bg-grey-200 p-4 h-[calc(100vh-64px)]">{children}</div>
			</div>
			{isLoading && <Loader />}
		</div>
	);
};

export default layout;
