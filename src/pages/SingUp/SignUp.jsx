import React, { useState } from "react";
import Signuphero from "../../assets/Signuphero.jpg";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { toast } from "sonner";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function SignUp() {
  const [isUsernameExist, setUsernameExist] = useState(false);
  const [isEmailExist, setEmailExist] = useState(false);
  const [ispasswordShown, setIsPasswordShown] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
  const passwordRegex =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;

  const schema = yup.object({
    name: yup
      .string()
      .required("Name Is Required")
      .min(3, "Name must be at least 3 Characters")
      .max(25, "Name Can not be More than 25 Charcters"),
    username: yup
      .string()
      .required("username Is Required")
      .min(3, "username must be at least 3 Characters")
      .max(25, "username Can not be More than 25 Charcters"),

    email: yup
      .string()
      .required('Email is Required"')
      .email("Email is invalid"),
    password: yup
      .string()
      .required("Password is Required")
      .matches(
        passwordRegex,
        "To ensure your account security, your password must be at least 8 characters long and include a combination of uppercase and lowercase English letters, at least one number, and at least one special character such as !, @, #, $, or %.",
      ),
    rePassword: yup
      .string()
      .required("confirm password is Required")
      .oneOf(
        [yup.ref("password")],
        "Password and Confirm Password should be the same",
      ),
    gender: yup
      .string()
      .required("Gender is riquired")
      .oneOf(["male", "female"], "gender can be one of male our female"),
    dateOfBirth: yup.string().required("Date Of Birth is Required"),
  });

  // * } Custom Validate
  // function validateSignup(values) {
  //   const errors = {};

  //   if (values.name === "") {
  //     errors.name = "Name Is Required";
  //   } else if (values.name.length < "3") {
  //     errors.name = "Name must be at least 3 Characters ";
  //   } else if (values.name.length > "25") {"Name Can not be More than 25 Charcters"
  //   }
  //   if (values.username === "") {
  //     errors.username = "User Name Is Required";
  //   } else if (values.username.length < "3") {
  //     errors.username = "Username must be at least 3 Characters ";
  //   } else if (values.username.length > "25") {
  //   }
  //   if (values.email === "") {
  //     errors.email = "Email is Required";
  //   } else if (!emailRegex.test(values.email)) {
  //     errors.email = "Email is invalid";
  //   }

  //   if (values.password === "") {
  //     errors.password = "Password is Required";
  //   } else if (!passwordRegex.test(values.password)) {
  //     errors.password =
  //       "To ensure your account security, your password must be at least 8 characters long and include a combination of uppercase and lowercase English letters, at least one number, and at least one special character such as !, @, #, $, or %.";
  //   }
  //   if (values.repassword === "") {
  //     errors.repassword = "confirm password is Required";
  //   } else if (values.repassword !== values.password) {
  //     errors.rePassword = " Password and Confirm Password should be the same";
  //   }
  //   if (values.gender === "") {
  //     errors.gender = "Gender is riquired";
  //   } else if (!["male", "female", " Male", "Female"].includes(values.gender)) {
  //     errors.gender = "gender can be one of male our female";
  //   }
  //   if (values.dateOfBirth === "") {
  //     errors.dateOfBirth = "Date Of Birth is Required";
  //   }
  //   return errors;
  // }

  function handleEmailChange(e) {
    setFieldValue("email", e.target.value);
    setEmailExist(false);
  }
  function handleUsernameChange(e) {
    setFieldValue("username", e.target.value);
    setUsernameExist(false);
  }

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    // validate: validateSignup,
    validationSchema: schema,

    onSubmit: async (values) => {
      console.log("SUBMIT START");
      console.log("VALUES:", values);

      try {
        const option = {
          method: "POST",
          url: "https://route-posts.routemisr.com/users/signup",
          headers: {
            "Content-Type": "application/json",
          },
          data: values,
        };

        const { data } = await axios.request(option);
        console.log(data);

        if (data.success) {
          toast.success("Account created successfully");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        if (error.response.data.message === "user already exists.") {
          setEmailExist(true);
        }
        if (error.response.data.message === "username already exists.") {
          setUsernameExist(true);
        }

        console.log("ERROR:", error);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
      }
    },
  });
  console.log(errors);

  return (
    <>
      <main className=" relative min-h-screen w-full bg-blue-200 flex items-center justify-center p-6 md:p-12 overflow-hidden">
        <div className="absolute top-8 right-8 w-56 h-56 bg-indigo-300/60 rounded-full pointer-events-none z-0"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 border-20 border-blue-600 rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch min-h-137.5">
          <div className="content w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-14">
            <div className="">
              <h1 className="text-center text-2xl font-semibold mb-8">
                Creat your Accont
              </h1>
              <form className="space-y-1" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label htmlFor="name" className="block">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={values.name}
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.name && touched.name ? (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      {errors.name}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="username" className="block">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={values.username}
                    name="username"
                    onChange={handleUsernameChange}
                    onBlur={handleBlur}
                  />
                  {errors.username && touched.username ? (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      {errors.username}
                    </p>
                  ) : (
                    ""
                  )}
                  {isUsernameExist && (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      Username Alredy Exist
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="block">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={values.email}
                    name="email"
                    onChange={handleEmailChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email ? (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      {errors.email}
                    </p>
                  ) : (
                    ""
                  )}
                  {isEmailExist && (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      Email Alredy Exist
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="block">
                    Password
                  </label>
                  <div className=" relative">
                    <input
                      type={ispasswordShown ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={values.password}
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      className=" absolute right-5 top-2"
                      onClick={() => {
                        setIsPasswordShown(!ispasswordShown);
                      }}
                    >
                      {ispasswordShown ? <Eye /> : <EyeOff />}{" "}
                    </button>
                  </div>
                  {errors.password && touched.password ? (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      {errors.password}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="rePassword" className="block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="rePassword"
                    value={values.rePassword}
                    name="rePassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.rePassword && touched.rePassword ? (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      {errors.rePassword}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="dateOfBirth" className="block">
                    Date Of Birth
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    value={values.dateOfBirth}
                    name="dateOfBirth"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.dateOfBirth && touched.dateOfBirth ? (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      {errors.dateOfBirth}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="gender" className="block">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="form-control"
                    value={values.gender}
                    name="gender"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && touched.gender ? (
                    <p
                      className="text-red-800 bg-red-200 text-sm px-3 py-1 rounded-md
                   font-medium"
                    >
                      {errors.gender}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <button
                  className="btn-primary text-center w-full mt-5 disabled:bg-black/70 disabled:cursor-not-allowed"
                  type="submit "
                  disabled={!(dirty && isValid)}
                >
                  {isSubmitting ? (
                    <LoaderCircle className=" animate-spin block mx-auto" />
                  ) : (
                    "Create Your Account"
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2 self-stretch overflow-hidden">
            <img
              src={Signuphero}
              alt="Signup Hero"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>
      </main>
    </>
  );
}
