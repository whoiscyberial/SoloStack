import { motion } from "framer-motion";
import React from "react";

type SwitchProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

const Switch = ({ state, setState, className }: SwitchProps) => {
  return (
    <div className={`${className} flex items-center gap-3`}>
      <motion.button
        layout
        className={` flex w-[56px] items-center rounded-lg transition-all duration-700 ${
          state ? "justify-start bg-neutral-800" : "justify-end bg-green-600"
        }`}
        onClick={() => {
          setState(!state);
        }}
      >
        <motion.button
          layout
          className="w-[28px] rounded-lg bg-neutral-300 text-neutral-300 shadow-md shadow-neutral-900/20"
        >
          x
        </motion.button>
      </motion.button>
      <span className="text-neutral-300">Show not verified tools</span>
    </div>
  );
};

export default Switch;
