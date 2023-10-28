import { motion } from "framer-motion";
import React from "react";

type SwitchProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  firstMessage: string;
  secondMessage: string;
};

const Switch = ({
  state,
  setState,
  className,
  firstMessage,
  secondMessage,
}: SwitchProps) => {
  return (
    <motion.div layout className={`${className} flex items-center`}>
      <motion.button
        layout
        className={`${
          state
            ? "cursor-default bg-neutral-800 font-medium"
            : "bg-transparent text-neutral-600 hover:border-neutral-700 hover:bg-neutral-700 hover:text-neutral-300"
        } w-full rounded-s-md border-2 border-neutral-800  py-2 text-center text-neutral-300 transition-all`}
        onClick={() => {
          if (state === false) {
            setState(true);
          }
        }}
      >
        {firstMessage}
      </motion.button>
      <motion.button
        layout
        className={`${
          state
            ? "bg-transparent text-neutral-600 hover:border-neutral-700 hover:bg-neutral-700 hover:text-neutral-300"
            : "cursor-default bg-neutral-800 font-medium"
        } w-full rounded-e-md border-2 border-neutral-800 bg-neutral-800 py-2 text-center  transition-all`}
        onClick={() => {
          if (state === true) {
            setState(false);
          }
        }}
      >
        {secondMessage}
      </motion.button>
    </motion.div>
  );
};

// const Switch = ({ state, setState, className, message }: SwitchProps) => {
//   return (
//     <div className={`${className} flex items-center gap-3`}>
//       <motion.button
//         layout
//         className={` flex w-[56px] items-center rounded-lg transition-all duration-700 ${
//           state ? "justify-start bg-neutral-800" : "justify-end bg-green-600"
//         }`}
//         onClick={() => {
//           setState(!state);
//         }}
//       >
//         <motion.div
//           layout
//           className="w-[28px] rounded-lg bg-neutral-300 text-neutral-300 shadow-md shadow-neutral-900/20"
//         >
//           x
//         </motion.div>
//       </motion.button>
//       {message && <span className="text-neutral-300">{message}</span>}
//     </div>
//   );
// };

export default Switch;
