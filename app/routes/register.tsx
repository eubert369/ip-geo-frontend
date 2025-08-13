import type { Route } from "./+types/home";
import RegisterPage from "~/pages/RegisterPage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Register" }, { name: "description", content: "Register" }];
}

export default function Login() {
  return <RegisterPage />;
}
