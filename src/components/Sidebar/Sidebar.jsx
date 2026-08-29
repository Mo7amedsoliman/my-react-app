import {
  ContactRound,
  GalleryHorizontalEnd,
  House,
  LogOut,
  Settings,
  UserRoundCog,
  Users,
  Share2,
} from "lucide-react";
import React, { useContext } from "react";
import { NavLink } from "react-router";
import { userContext } from "../../context/User.context";

export default function Sidebar() {
  const { token, userInfo } = useContext(userContext);

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col justify-between border-r border-gray-200 bg-gray-100 p-6">
      <div className="space-y-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow-md">
            <Share2 size={22} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            LinkedPosts
          </span>
        </div>

        {/* Navigation Menu */}
        <ul className="space-y-2">
          <li>
            <NavLink
              to={`/`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition ${
                  isActive
                    ? `bg-black text-white`
                    : `text-gray-700 hover:bg-gray-200`
                }`
              }
            >
              <House size={20} />
              <span>News Feed</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/profile`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition ${
                  isActive
                    ? `bg-black text-white`
                    : `text-gray-700 hover:bg-gray-200`
                }`
              }
            >
              <UserRoundCog size={20} />
              <span>Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/group`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition ${
                  isActive
                    ? `bg-black text-white`
                    : `text-gray-700 hover:bg-gray-200`
                }`
              }
            >
              <Users size={20} />
              <span>Group</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/friends`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition ${
                  isActive
                    ? `bg-black text-white`
                    : `text-gray-700 hover:bg-gray-200`
                }`
              }
            >
              <ContactRound size={20} />
              <span>Friends</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/media`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition ${
                  isActive
                    ? `bg-black text-white`
                    : `text-gray-700 hover:bg-gray-200`
                }`
              }
            >
              <GalleryHorizontalEnd size={20} />
              <span>Media</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/settings`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition ${
                  isActive
                    ? `bg-black text-white`
                    : `text-gray-700 hover:bg-gray-200`
                }`
              }
            >
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* User Info & Logout Button */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <img
            src={userInfo?.photo}
            alt={userInfo?.name}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-semibold text-gray-900">
              {userInfo?.name || "Loading..."}
            </span>
            <span className="truncate text-xs text-gray-500">
              @{userInfo?.username}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
