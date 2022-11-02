import { useState } from "react";

export const Login = () => {
  const [loginFields, setLoginFields] = useState({
    email: "",
    password: "",
    fireErrors: "",
  });
  return (
    <form class="flex flex-col border bg-gray-100 mx-auto max-w-md p-9 space-y-2">
      <label htmlFor="email">Email:</label>
      <input type="text" placeholder="Email" name="email" />
      <label htmlFor="">Password:</label>
      <input type="text" placeholder="Password" name="password" />
      <button class="border border-blue-400" type="submit">
        Enter
      </button>
    </form>
  );
};
