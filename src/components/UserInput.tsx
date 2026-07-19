interface Props extends React.ComponentProps<"input"> {
  label: string;
}

function UserInput({ label, ...props }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="" className="font-bold min-w-14">
        {label}
      </label>
      <input className="flex-1 p-2 border rounded-sm" {...props} />
    </div>
  );
}

export default UserInput;
