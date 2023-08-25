export const Link = (props: JSX.IntrinsicElements["a"]) => (
  <a
    {...props}
    className={`border-b-2 cursor-pointer border-primary text-primary hover:opacity-70 transition-opacity ${
      props.className || ""
    }`}
  >
    {props.children}
  </a>
);
