import { useFormik } from "formik";
import { ImagePlus, MapPin, Smile, Sparkles, X } from "lucide-react";

import * as yup from "yup";
import { userContext } from "../../context/User.context";
import axios from "axios";
import { toast } from "sonner";
import { useState, useContext } from "react";

export default function PostForm() {
  const { token, userInfo } = useContext(userContext);
  const [imagePreview, setImagePreview] = useState(null);
  console.log(userInfo);

  const Schema = yup.object({
    body: yup.string().min(10),
    image: yup
      .mixed()
      .test("fileSize", "image size can not exceed 5MB ", (value) => {
        if (!value || value.size > 5 * 1024 * 1024) {
          return false;
        }
        return true;
      })
      .test("fileType", "you msut upload an image ", (value) => {
        if (
          !value ||
          ["imge / jpg", "image/jpeg", "image/png"].includes(value.type)
        ) {
          return true;
        } else return false;
      }),
  });
  const Formek = useFormik({
    initialValues: {
      body: "",
      image: "",
    },

    validationSchema: Schema,

    onSubmit: async function (values, { resetForm }) {
      try {
        const myformData = new FormData();
        myformData.append("body", values.body);
        myformData.append("image", values.image);

        const config = {
          url: "https://route-posts.routemisr.com/posts",
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: myformData,
        };
        const { data } = await axios.request(config);
        if (data.success) {
          toast.success(data.message);
          resetForm();
          setImagePreview(null);
        }
      } catch (error) {}
    },
  });
  if (!userInfo) {
    return <div className="p-4 text-center">Loading user info...</div>;
  }
  return (
    <form onSubmit={Formek.handleSubmit}>
      <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_45px_-22px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Create a post
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Share a thought, a photo, or both.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close post composer"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-5 pt-5 sm:px-6">
          <div className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
              <img src={userInfo.photo} />
            </div>
            <div className="pt-0.5">
              <p className="text-sm font-semibold text-slate-900">
                {userInfo.name}
              </p>
              <button
                type="button"
                className="mt-1 flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                Public
              </button>
            </div>
          </div>

          <textarea
            rows="4"
            aria-label="Post caption"
            placeholder="What's on your mind?"
            className="mt-4 w-full resize-none bg-transparent text-[17px] leading-7 text-slate-800 outline-none placeholder:text-slate-400"
            value={Formek.values.body}
            name="body"
            onChange={Formek.handleChange}
            onBlur={Formek.handleBlur}
          />
          {imagePreview && (
            <div className="px-4 pb-3">
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Selected attachment"
                  className="max-h-104 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    Formek.setFieldValue("image", null);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}
          {!imagePreview && (
            <label className="group mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-4 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100">
                <ImagePlus size={21} />
              </span>
              <span className="mt-3 text-sm font-semibold text-slate-700">
                Add a photo
              </span>
              <span className="mt-1 text-xs text-slate-400">
                Drag and drop or click to browse
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                name="image"
                onChange={(e) => {
                  const image = e.target.files[0];
                  Formek.setFieldValue("image", image);
                  const imageURL = URL.createObjectURL(image);
                  setImagePreview(imageURL);
                }}
                onBlur={Formek.handleBlur}
              />
            </label>
          )}
        </div>
        <div className="p-2 space-y-2">
          {" "}
          {Formek.errors.body && Formek.touched.body ? (
            <p className="text-red-800 bg-red-100 text-sm px-3 py-1 rounded-md font-medium">
              {Formek.errors.body}
            </p>
          ) : (
            ""
          )}
          {Formek.errors.image && Formek.touched.image ? (
            <p className="text-red-800 bg-red-100 text-sm px-3 py-1 rounded-md font-medium">
              {Formek.errors.image}
            </p>
          ) : (
            ""
          )}
        </div>

        <div className="mx-5 mt-5 flex items-center justify-between border-y border-slate-100 py-3 sm:mx-6">
          <p className="text-sm font-medium text-slate-600">Add to your post</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Add photo"
              className="grid h-9 w-9 place-items-center rounded-full text-emerald-600 transition hover:bg-emerald-50"
            >
              <ImagePlus size={20} />
            </button>
            <button
              type="button"
              aria-label="Add feeling"
              className="grid h-9 w-9 place-items-center rounded-full text-amber-500 transition hover:bg-amber-50"
            >
              <Smile size={20} />
            </button>
            <button
              type="button"
              aria-label="Add location"
              className="grid h-9 w-9 place-items-center rounded-full text-rose-500 transition hover:bg-rose-50"
            >
              <MapPin size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
            <Sparkles size={14} className="text-violet-500" /> Be kind and share
            freely
          </span>
          <button
            type="submit"
            className="ml-auto rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            Publish post
          </button>
        </div>
      </section>
    </form>
  );
}
