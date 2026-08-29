import React, { useContext, useState } from "react";
import loginhero from "../../assets/loginhero.jpg";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { toast } from "sonner";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";

import { userContext } from "../../context/User.context";

export default function Login() {
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const navigate = useNavigate();

  const { setToken } = useContext(userContext);

  const passwordRegex =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;

  const schema = yup.object({
    email: yup.string().required("Email is Required").email("Email is invalid"),
    password: yup
      .string()
      .required("Password is Required")
      .matches(
        passwordRegex,
        "To ensure your account security, your password must be at least 8 characters long and include a combination of uppercase and lowercase English letters, at least one number, and at least one special character such as !, @, #, $, or %.",
      ),
  });

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,

    onSubmit: async (values) => {
      try {
        const option = {
          method: "POST",
          url: "https://route-posts.routemisr.com/users/signin",
          headers: {
            "Content-Type": "application/json",
          },
          data: values,
        };

        const { data } = await axios.request(option);

        if (data.message === "success" || data.success) {
          toast.success("Welcome back");
          console.log(data);

          setToken(data.data.token);
          localStorage.setItem("token", data.data.token);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error) {
        console.log({ error });
        if (error?.response?.data?.message === "incorrect email or password") {
          setWrongCredentials(true);
        }

        console.log("ERROR:", error);
      }
    },
  });

  return (
    <>
      <main className="relative min-h-screen w-full bg-gray-300 flex items-center justify-center p-6 md:p-12 overflow-hidden">
        {/* الدائرة السماوية الفاتحة - فوق يمين */}
        <div className="absolute top-8 right-8 w-56 h-56 bg-blue-100/80 rounded-full pointer-events-none z-0"></div>

        {/* الدائرة المفرغة - تحت شمال */}
        <div className="absolute -bottom-12 -left-12 w-64 h-64 border-20 border-blue-600 rounded-full pointer-events-none z-0"></div>

        {/* الكارت الرئيسي */}
        <div className="relative z-10 w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch min-h-[550px]">
          {/* قسم الفورم */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-14">
            <h1 className="text-center text-4xl font-bold mb-8 text-gray-800">
              Welcome Back
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-base font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control "
                  id="email"
                  value={values.email}
                  name="email"
                  onChange={(e) => {
                    handleChange(e);
                    setWrongCredentials(false);
                  }}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && (
                  <p className="text-red-800 bg-red-100 text-sm px-3 py-1 rounded-md font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-base font-medium text-gray-700"
                >
                  Password
                </label>
                <div className=" relative">
                  <input
                    type={isPasswordShown ? "text" : "password"}
                    className="form-control "
                    id="password"
                    value={values.password}
                    name="password"
                    onChange={(e) => {
                      handleChange(e);
                      setWrongCredentials(false);
                    }}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    className=" absolute  right-5 top-2"
                    onClick={() => {
                      setIsPasswordShown(!isPasswordShown);
                    }}
                  >
                    {isPasswordShown ? <Eye /> : <EyeOff />}
                  </button>
                </div>

                {errors.password && touched.password && (
                  <p className="text-red-800 bg-red-100 text-sm px-3 py-1 rounded-md font-medium">
                    {errors.password}
                  </p>
                )}
                {wrongCredentials && (
                  <p className="text-red-800 bg-red-100 text-sm px-3 py-1 rounded-md font-medium">
                    incorrect email or password
                  </p>
                )}
              </div>

              <button
                className="btn-primary w-full mt-6 py-3.5 bg-gray-400 text-white font-medium rounded-xl hover:bg-gray-500 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-lg"
                type="submit"
                disabled={!(dirty && isValid)}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin h-6 w-6" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          {/* قسم الصورة */}
          <div className="hidden lg:block lg:w-1/2 self-stretch overflow-hidden">
            <img
              src={loginhero}
              alt="Signin Hero"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>
      </main>
    </>
  );
}
