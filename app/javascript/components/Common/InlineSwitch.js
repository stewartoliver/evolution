// InlineSwitch.js
import React from "react";

const InlineSwitch = ({ checked, onCheckedChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="hidden"
    />
    <div className={`w-8 h-4 ${checked ? "bg-primary-500" : "bg-gray-300"} rounded-full relative`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : ""}`} />
    </div>
  </label>
);

export default InlineSwitch;
