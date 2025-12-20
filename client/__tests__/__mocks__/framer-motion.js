import React from "react";

const Mock = React.forwardRef(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>{children}</div>
));
Mock.displayName = "FramerMotionMock";

export const AnimatePresence = ({ children }) => children;
export const LazyMotion = ({ children }) => children;
export const domAnimation = {};
export const motion = new Proxy({}, { get: () => Mock });
export const m = new Proxy({}, { get: () => Mock });
