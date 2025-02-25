import React from "react";
import clsx from "clsx";

// ✅ Button Variants
const buttonVariants = {
  primary:
    "bg-accent text-white font-semibold hover:bg-accent-hover focus:outline-none focus:ring-4 focus:ring-accent/40 cursor-pointer",
  secondary:
    "bg-white font-medium text-dark hover:text-accent focus:outline-none focus:ring-4 focus:ring-gray-100 border border-gray-200 cursor-pointer",
  disabled: "bg-gray-300 font-medium  text-gray-500 cursor-not-allowed",
};

// ✅ Button Sizes
const buttonSizes = {
  small: "px-3 py-2 text-sm max-w-sm",
  medium: "px-4 py-2 text-base max-w-md",
  large: "px-6 py-3 text-lg max-w-lg",
};

// ✅ Reusable Button Component
const Button = ({
  buttonType = "primary",
  buttonSize = "medium",
  icon: Icon,
  onClick,
  children,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "flex items-center justify-center gap-2 rounded-lg transition focus:outline-none focus:ring-4",
        buttonVariants[buttonType], // ✅ Use variant styles
        buttonSizes[buttonSize], // ✅ Use size styles
        className
      )}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="size-5" />}
      {children}
    </button>
  );
};

export default Button;

// MARK: - How to use
{
  /* 
<Button buttonType="primary" buttonSize="large">
  Primary Button
</Button>

<Button
  buttonType="secondary"
  buttonSize="medium"
  icon={LucideIcons.Plus}
>
  Add Item
</Button>

<Button buttonType="disabled" buttonSize="small">
  Disabled
</Button>

<Button
  buttonType="primary"
  buttonSize="large"
  icon={LucideIcons.CheckCircle}
>
  Confirm
</Button> */
}
