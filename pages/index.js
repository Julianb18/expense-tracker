import { useState } from "react";
import { Login } from "../components/Forms/Login";

export default function Home() {
  const [user, setUser] = useState(1);
  const [loading, setLoading] = useState(true);

  return (
    <div class="h-screen w-full">
      <Login />
    </div>
  );
}
