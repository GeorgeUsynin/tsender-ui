"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import "@rainbow-me/rainbowkit/styles.css";

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            window.open("https://github.com/GeorgeUsynin", "_blank")
          }
          className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
        >
          <FaGithub size={28} />
        </button>

        <h1 className="font-semibold text-lg">TSender</h1>
      </div>

      <ConnectButton showBalance={false} />
    </header>
  );
};
