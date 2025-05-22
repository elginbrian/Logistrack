"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingBag, BarChart, Settings, ChevronRight, LogOut } from "lucide-react";

const menuItems = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Stock",
    icon: Package,
    href: "/stock",
  },
  {
    label: "Manage",
    icon: ShoppingBag,
    href: "/manage",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Set active item based on current path
    const currentPath = pathname === "/" ? "Home" : pathname === "/stock" ? "Stock" : pathname === "/manage" ? "Manage" : "";
    setActiveItem(currentPath);
  }, [pathname]);

  return (
    <div className={`h-full ${collapsed ? "w-20" : "w-64"} shadow-lg bg-white flex flex-col overflow-hidden transition-all duration-300`}>
      <div className="flex items-center justify-between px-4 pt-8 pb-6">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center mr-2 rotate-12">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LogisTrack</h1>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="h-10 w-10 bg-blue-600 rounded-md flex items-center justify-center rotate-12">
              <span className="text-white font-bold text-xl">L</span>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <ChevronRight className={`h-4 w-4 text-gray-600 transition-transform ${collapsed ? "rotate-0" : "rotate-180"}`} />
        </button>
      </div>
      <hr className="border-t border-gray-200 my-2 mx-5" />

      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-3 mt-3 text-gray-700">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            const isHovered = hoveredItem === item.label;

            return (
              <Link href={item.href} key={index} onClick={() => setActiveItem(item.label)} className="block" onMouseEnter={() => setHoveredItem(item.label)} onMouseLeave={() => setHoveredItem(null)}>
                <li
                  className={`
                    flex items-center gap-3 px-3 h-12 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${isActive ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium" : isHovered ? "bg-gray-50 border-l-4 border-gray-300" : "border-l-4 border-transparent"}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                  {!collapsed && <span>{item.label}</span>}
                  {collapsed && isActive && <div className="absolute left-16 bg-white text-blue-600 shadow-md px-3 py-1 rounded-md text-sm z-50">{item.label}</div>}
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto">
        <div className={`flex items-center gap-2 px-4 py-3 mx-3 my-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${collapsed ? "justify-center" : ""}`}>
          <Settings className="h-5 w-5 text-gray-500" />
          {!collapsed && <span className="text-sm text-gray-700">Settings</span>}
        </div>
        <div className={`bg-gray-50 m-3 p-3 rounded-lg ${collapsed ? "text-center" : ""}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="font-medium text-blue-700">U</span>
            </div>
            {!collapsed && <span className="font-medium text-sm">User</span>}
          </div>
          {!collapsed && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">LogisTrack v1.0</span>
              <button className="text-xs text-red-500 flex items-center gap-1">
                <LogOut className="h-3 w-3" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
