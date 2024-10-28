// components/Common/InlineButton.jsx
import React from "react";
import PropTypes from "prop-types"; // Optional: for prop type validation

const InlineButton = ({
  children,
  onClick,
  variant = "primary",
  size = "sm",
  className = "",
  type = "button", // Default type set to "button"
}) => (
  <button
    type={type} // Explicitly set the button type
    onClick={onClick}
    className={`
      inline-flex items-center 
      ${variant === "outline" 
        ? "border border-primary-500 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900"
        : "bg-primary-500 text-white hover:bg-primary-600"
      }
      ${size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base"}
      font-medium rounded-md transition ${className}
    `}
  >
    {children}
  </button>
);

InlineButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "outline"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default InlineButton;
