export const H1 = (props: JSX.IntrinsicElements["h1"]) => (
  <h1 {...props} className={`text-6xl font-bold ${props.className || ""}`}>
    {props.children}
  </h1>
);
