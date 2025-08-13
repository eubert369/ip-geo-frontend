import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const apiUrl = import.meta.env.VITE_API_URL || "No API URL set";

interface FormTypes {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [form, setForm] = useState<FormTypes>({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/home");
    }
  }, []);

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("form:", apiUrl, form);

    try {
      const req = await fetch(`${apiUrl}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const res = await req.json();

      console.log("Registration Response:", res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <form
        className="w-1/3 h-fit p-5 rounded-2xl flex flex-col gap-5 border"
        onSubmit={formSubmit}
      >
        <Link to="/" className="text-center text-2xl font-bold">
          Register
        </Link>
        <div className="w-full h-fit flex flex-col gap-3">
          <div className="w-full h-fit flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="w-full rounded-md border px-2 py-1 focus:outline-0"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="w-full h-fit flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border px-2 py-1 focus:outline-0"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="w-full h-fit flex flex-col">
            <label htmlFor="password">Password</label>
            <div className="w-full h-fit pr-1 rounded-md border flex gap-3">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full h-fit px-2 py-1 focus:outline-0"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className="w-fit h-fit">
                  <img
                    src={
                      showPassword
                        ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWV5ZS1pY29uIGx1Y2lkZS1leWUiPjxwYXRoIGQ9Ik0yLjA2MiAxMi4zNDhhMSAxIDAgMCAxIDAtLjY5NiAxMC43NSAxMC43NSAwIDAgMSAxOS44NzYgMCAxIDEgMCAwIDEgMCAuNjk2IDEwLjc1IDEwLjc1IDAgMCAxLTE5Ljg3NiAwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPjwvc3ZnPg=="
                        : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWV5ZS1jbG9zZWQtaWNvbiBsdWNpZGUtZXllLWNsb3NlZCI+PHBhdGggZD0ibTE1IDE4LS43MjItMy4yNSIvPjxwYXRoIGQ9Ik0yIDhhMTAuNjQ1IDEwLjY0NSAwIDAgMCAyMCAwIi8+PHBhdGggZD0ibTIwIDE1LTEuNzI2LTIuMDUiLz48cGF0aCBkPSJtNCAxNSAxLjcyNi0yLjA1Ii8+PHBhdGggZD0ibTkgMTggLjcyMi0zLjI1Ii8+PC9zdmc+"
                    }
                    alt="icon"
                  />
                </i>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-fit flex flex-col gap-1">
          <button
            type="submit"
            className={`w-full h-fit rounded border py-1 font-bold cursor-pointer hover:scale-105`}
          >
            Register
          </button>
          <p className="text-center text-sm">
            Already have an account?
            <Link to="/" className="hover:font-bold">
              Login
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
