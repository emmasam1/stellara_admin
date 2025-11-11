import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // adjust path to your logo

const Loader = () => {
  return (
    <div className="flex items-center justify-center bg-black rounded-full w-50 h-50">
      <motion.div
        className="flex flex-col items-center justify-center rounded-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Logo with heartbeat effect */}
        <motion.img
          src={logo}
          alt="Logo"
          className="w-42 h-42 object-contain -mt-20"
          animate={{
            scale: [1, 1.2, 1], // heartbeat pulse
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        />

        {/* Text shimmer effect */}
        <motion.h1
          className="text-sm font-bold text-yellow-400 tracking-wide !-mt-15"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          Loading Stellara...
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default Loader;
