import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "gray" | "green";
}

const LoadingSpinner = ({ size = "md", color = "blue" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const colorClasses = {
    blue: "border-blue-600",
    gray: "border-gray-600",
    green: "border-green-600",
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-2 border-t-transparent ${colorClasses[color]} rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
