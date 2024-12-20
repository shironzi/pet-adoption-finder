import React, { useState, memo, useEffect, useCallback } from "react";
import { register } from "../apis/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const result = await register(
          formData.email,
          formData.password,
          formData.confirmPassword,
          formData.firstName,
          formData.lastName
        );

        if (result.status === 201) {
          navigate("/auth/login");
        } else {
          const data = await result.json();
          if (data && data.errors) {
            const error = data.errors.map((error) => error.msg);
            setErrorMsg(error);
          } else {
            setErrorMsg(["Something went wrong, please try again."]);
          }
          setIsInvalid(true);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [formData, navigate]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {isInvalid ? (
          <label className="auth-invalid-input">{errorMsg}</label>
        ) : null}
        <input
          name="firstName"
          id="firstName"
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
        <input
          name="lastName"
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
        <input
          name="email"
          id="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          name="password"
          id="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <input
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default memo(Register);
