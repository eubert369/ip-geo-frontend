import type { Route } from "./+types/home";
import LoginPage from "~/pages/LoginPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
