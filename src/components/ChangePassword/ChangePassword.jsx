import React, { useState, useContext } from "react";
import axios from "axios";
import { userContext } from "../../context/User.context";
import { useNavigate } from "react-router";
export default function ChangePassword() {
  // 1. استدعاء setToken لتحديث الـ State الخاصة بالـ Context
  const { token, setToken } = useContext(userContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const options = {
        url: "https://route-posts.routemisr.com/users/change-password",
        method: "PATCH",
        headers: {
          token: localStorage.getItem("userToken") || token,
          "Content-Type": "application/json",
        },
        data: {
          password: password,
          newPassword: newPassword,
        },
      };

      const { data } = await axios.request(options);

      // 2. تحديث التوكن في الـ LocalStorage والـ Context لمنع خطأ 401
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        if (setToken) {
          setToken(data.token);
        }
      }

      setMessage({ type: "success", text: "Password changed successfully!" });
      setPassword("");
      setNewPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Change Password</h2>

      {message.text && (
        <div
          className={`p-3 mb-4 text-sm rounded-xl ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
