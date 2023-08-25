export const TextField = (
  props: { label: string } & JSX.IntrinsicElements["input"]
) => {
  return (
    <div className="mb-4 inline-block">
      <label className="block mb-1 font-medium">{props.label}</label>
      <input
        {...props}
        className="w-full py-2 px-3 rounded-md shadow-md border-2 border-gray-300 focus:outline-none focus:border-primary"
      />
    </div>
  );
};
