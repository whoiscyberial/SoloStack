import React from "react";
import toast from "react-hot-toast";

const notification = (message: string) => {
  return toast(message, {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    style: {
      borderRadius: "4px",
      background: "#1e1e1e",
      color: "rgba(255,255,255,0.8)",
      padding: "16px 48px 16px 48px",
      maxWidth: "640px",
    },
    duration: 4000,
    position: "top-center",
  });
};

export default notification;
