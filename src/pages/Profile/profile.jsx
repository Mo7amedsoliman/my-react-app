import React, { useState, useContext } from "react";
import {
  Bookmark,
  Calendar,
  Camera,
  ImagePlus,
  Mail,
  Pencil,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { userContext } from "../../context/User.context";
import axios from "axios";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
export default function ProfilePage() {
  const { userInfo, token } = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);
  // 1. State لتخزين الصورة الجديدة وتحديثها في الحال
  const [userPhoto, setUserPhoto] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  // 2. دالة رفع الصورة إلى API
  async function uploadPhoto(file) {
    if (!file) return;

    try {
      setLoadingUpload(true);
      const formData = new FormData();
      formData.append("photo", file);

      const options = {
        url: "https://route-posts.routemisr.com/users/upload-photo",
        method: "PUT",
        headers: {
          token: localStorage.getItem("userToken") || token,
        },
        data: formData,
      };

      const { data } = await axios.request(options);

      // تحديث الرابط برقم عشوائي لتفادي كاش المتصفح (Cache Busting)
      if (data?.user?.photo) {
        setUserPhoto(`${data.user.photo}?t=${Date.now()}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoadingUpload(false);
    }
  }

  // 3. دالة الاستماع لتغيير الملف من الـ Input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      uploadPhoto(selectedFile);
    }
  };

  if (!userInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="font-medium text-slate-500">Loading profile...</div>
      </div>
    );
  }

  const hasCover = Boolean(userInfo?.cover);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        {/* Cover */}
        <div
          className="relative h-48 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 sm:h-64"
          style={
            hasCover
              ? {
                  backgroundImage: `url(${userInfo.cover})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : undefined
          }
        >
          {!hasCover && (
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
          )}

          <button
            type="button"
            className="absolute right-4 top-4 flex items-center gap-2 rounded-xl border border-white/20 bg-black/30 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-black/50 sm:text-sm"
          >
            {hasCover ? <Pencil size={16} /> : <ImagePlus size={16} />}
            {hasCover ? "Edit Cover" : "Upload Cover"}
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6 pt-16 sm:px-8 sm:pb-8 sm:pt-20">
          {/* Profile Image */}
          <div className="absolute -top-16 left-6 sm:-top-20 sm:left-8">
            <img
              // استخدام userPhoto إذا كانت موجوة، أو الصورة القديمة من الـ Context
              src={userPhoto || userInfo?.photo}
              alt={userInfo?.name || "Profile"}
              className={`h-28 w-28 rounded-full border-4 border-white object-cover shadow-md sm:h-36 sm:w-36 ${
                loadingUpload ? "opacity-50" : ""
              }`}
            />

            {/* Upload Image Button */}
            <span className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-slate-800 p-2 text-white shadow-md hover:bg-slate-700">
              <label htmlFor="img" className="cursor-pointer">
                <Camera size={18} />
              </label>

              <input
                type="file"
                id="img"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange} // ربط الفنكشن هنا
              />
            </span>
          </div>

          {/* Name + Edit */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {userInfo?.name}
                </h1>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                  @{userInfo?.username}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
          {isOpen && <ChangePassword />}
          {/* User Details */}
          <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-indigo-500" />
              <span className="truncate">{userInfo?.email}</span>
            </div>

            <div className="flex items-center gap-2 capitalize">
              <User size={16} className="shrink-0 text-indigo-500" />
              <span>{userInfo?.gender}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="shrink-0 text-indigo-500" />
              <span>Born {formatDate(userInfo?.dateOfBirth)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="shrink-0 text-indigo-500" />
              <span>Joined {formatDate(userInfo?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 border-y border-slate-100 bg-slate-50/50 py-4">
          <div className="flex flex-col items-center border-r border-slate-200/60 last:border-r-0">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Users size={16} className="text-indigo-500" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Followers
              </span>
            </div>
            <span className="mt-1 text-xl font-bold text-slate-900">
              {userInfo?.followersCount ?? 0}
            </span>
          </div>

          <div className="flex flex-col items-center border-r border-slate-200/60 last:border-r-0">
            <div className="flex items-center gap-1.5 text-slate-500">
              <UserPlus size={16} className="text-indigo-500" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Following
              </span>
            </div>
            <span className="mt-1 text-xl font-bold text-slate-900">
              {userInfo?.followingCount ?? 0}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Bookmark size={16} className="text-indigo-500" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Bookmarks
              </span>
            </div>
            <span className="mt-1 text-xl font-bold text-slate-900">
              {userInfo?.bookmarksCount ?? 0}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 text-center text-slate-400">
          <p className="text-sm">No posts to show right now.</p>
        </div>
      </div>
    </div>
  );
}
