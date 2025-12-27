import React from "react";

const cleanMotionProps = (props) => {
  const sanitized = { ...props };
  [
    "initial",
    "animate",
    "exit",
    "variants",
    "transition",
    "whileTap",
    "whileHover",
    "onAnimationComplete",
    "onAnimationStart",
  ].forEach((key) => delete sanitized[key]);
  return sanitized;
};

const Mock = React.forwardRef(({ children, ...props }, ref) => (
  <div ref={ref} {...cleanMotionProps(props)}>{children}</div>
));
Mock.displayName = "FramerMotionMock";

export const AnimatePresence = ({ children }) => children;
export const LazyMotion = ({ children }) => children;
export const domAnimation = {};
export const motion = new Proxy({}, { get: () => Mock });
export const m = new Proxy({}, { get: () => Mock });
