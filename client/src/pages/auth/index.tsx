import { Outlet } from "react-router-dom";

export default function AuthPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Outlet />
    </div>
  );
}
