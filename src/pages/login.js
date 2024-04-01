import React, { useRef, useState } from "react";
import styles from "../styles/Login.module.scss";
import { useGlobalContext } from "@/context";
import { useRouter } from "next/router";
import axios from "../axios";

const Login = () => {
  const { setUser } = useGlobalContext();

  const [error, setError] = useState(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const proceed = loginValidation(
      emailRef.current.value,
      passwordRef.current.value
    );
    setError(proceed?.error);

    if (proceed.validation === "success") {
      try {
        const payload = {
          email: emailRef.current.value,
          password: passwordRef.current.value
        }
        const res = await axios.post("/users/login", payload);
        console.log(res);
        setUser(res.data.data.user);
        router.replace("/");
      } catch (error) {
        setError(error.response?.data.message);
      }
    }
  };

  const loginValidation = (email, password) => {
    if (email === "" || email === null)
      return { validation: "failed", error: "Please enter your email" };

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email))
      return { validation: "failed", error: "Please enter a valid email" };

    if (password === "" || password === null)
      return { validation: "failed", error: "Please enter your password" };

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password))
      return {
        validation: "failed",
        error:
          "Password should be 8 characters long which contains at least one letter and one number",
      };

    return {
      validation: "success",
      error: null,
    };
  };

  return (
    <div className={styles.login}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className={styles.inputs}>
          {error !== null && <h6 className={styles.error}>{error}</h6>}
          <label htmlFor="email">
            <p>Email</p>
          </label>
          <input type="text" id="email" ref={emailRef} />
          <label htmlFor="password">
            <p>Password</p>
          </label>
          <input type="password" id="password" ref={passwordRef} />

          <button type="submit">
            <p>Login</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
