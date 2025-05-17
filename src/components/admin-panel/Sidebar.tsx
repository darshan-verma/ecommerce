"use client";
import React from "react";
import { MdDashboard, MdManageAccounts, MdCategory, MdOutlineInventory2 } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { IoAnalytics, IoSettings, IoLogOutOutline } from "react-icons/io5";
import { RiShoppingCartLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const menus = [
  // {
  //   title: "Dashboard",
  //   icon: <MdDashboard className="w-5 h-5" />,
  //   href: "/admin/dashboard",
  // },
  {
    title: "Analytics",
    icon: <IoAnalytics className="w-5 h-5" />,
    href: "/admin/analytics",
  },
  {
    title: "Products",
    icon: <RiShoppingCartLine className="w-5 h-5" />,
    href: "/admin/products",
  },
  {
    title: "Categories",
    icon: <MdCategory className="w-5 h-5" />,
    href: "/admin/categories",
  },
  {
    title: "Inventory",
    icon: <MdOutlineInventory2 className="w-5 h-5" />,
    href: "/admin/inventory",
  },
  {
    title: "Orders",
    icon: <GrTransaction className="w-5 h-5" />,
    href: "/admin/orders",
  },
  {
    title: "Customers",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/admin/customers",
  },
];

const settingsMenu = [
  {
    title: "Settings",
    icon: <IoSettings className="w-5 h-5" />,
    href: "/admin/settings",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin");
  };

  return (
    <div className="hidden md:flex flex-col w-64 h-screen px-4 py-8 bg-white border-r dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center gap-3 px-4 mb-8">
        <img className="w-10 h-10 rounded-lg" src="/favicon.ico" alt="logo" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Admin Panel
        </h2>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="space-y-1">
          <div className="px-4 mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Main
          </div>
          {menus.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                  isActive && "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Settings
            </div>
            {settingsMenu.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={`settings-${idx}`}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive && "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-6">
          <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Need help?{' '}
              <a href="#" className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400">
                Contact support
              </a>
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 mt-4 text-sm font-medium text-red-600 transition-colors duration-200 transform rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <IoLogOutOutline className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
