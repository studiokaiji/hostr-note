export const Button = (
  props: {
    variant?: "primary" | "outlined";
    size?: "small" | "default";
  } & JSX.IntrinsicElements["button"]
) => {
  const { size, children, variant = "primary" } = props;

  let className =
    "cursor-pointer py-2.5 px-6 rounded-full font-medium shadow-md transition-all duration-200 border-2 border-primary";

  if (variant === "primary") {
    className += " bg-primary text-white hover:bg-opacity-80";
  } else if (variant === "outlined") {
    className += " text-primary hover:bg-primary hover:bg-opacity-20";
  }

  if (size === "small") {
    className += " py-1.5 px-4";
  }

  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
};
