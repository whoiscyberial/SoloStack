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
      background: "rgba(1,1,1,0.4)",
      color: "rgba(255,255,255,0.8)",
      padding: "16px 48px 16px 48px",
      maxWidth: "640px",
    },
    duration: 4000,
  });

  return toast.custom(
    (t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } pointer-events-auto flex w-full max-w-md cursor-pointer rounded-lg border border-neutral-200/5 bg-neutral-900/90 shadow-lg ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex items-center justify-center gap-2 px-6 py-4">
          <div className="flex-shrink">
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
          </div>
          <p className="mt-1">{message}</p>
        </div>
      </div>
    ),
    {
      duration: 2000,
      position: "bottom-left",
    },
  );
};

export default notification;
