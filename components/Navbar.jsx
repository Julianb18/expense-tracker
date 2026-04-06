import React, { useRef } from "react";
import { Menu } from "@headlessui/react";

import { useAuth } from "../context/AuthContext";
import { MoneySvg } from "./svg/MoneySvg";
import { Button } from "./Button";
import { LoginModal } from "./LoginModal";
import Link from "next/link";

export const Navbar = () => {
  const { authUser, signOut } = useAuth();
  const loginModalRef = useRef();

  const handleLoginClick = () => {
    loginModalRef.current?.open();
  };

  return (
    <header className="fixed top-0 w-full shadow-lg shadow-primaryDark z-50 flex justify-between items-center px-3 py-3 bg-primaryDark text-white">
      <Link href="/dashboard" className="text-slate-300 flex gap-4">
        <MoneySvg /> ExpenseTracker
      </Link>

      {authUser ? (
        <Menu
          as="div"
          className=" border border-secondaryDark bg-buttonSecondary w-8 h-8 rounded-full text-white relative inline-block text-left"
        >
          <Menu.Button className="w-full h-full rounded-full text-sm font-medium">
            {(authUser?.displayName || authUser?.email || "G")
              .charAt(0)
              .toUpperCase()}
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-[60] mt-2 w-56 origin-top-right rounded-xl border border-slate-600 bg-slate-900/98 shadow-xl shadow-black/40 backdrop-blur-sm focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={signOut}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-700 text-white"
                      : "text-slate-200 hover:bg-slate-800/90"
                  }`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <Button filled onClick={handleLoginClick}>
          Login / Register
        </Button>
      )}

      <LoginModal ref={loginModalRef} />
    </header>
  );
};
