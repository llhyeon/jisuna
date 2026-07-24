import type { ComponentProps } from "react";

interface Props extends ComponentProps<"select"> {
  label: string;
  options: {
    id: string | number;
    label: string | number;
    leader?: string | null;
    color?:
      | {
          bg: string;
          border: string;
          text: string;
        }
      | string;
    value?: string | number;
  }[];
}

function UserDropdown({ label, options, ...props }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="" className="font-bold min-w-14">
        {label}
      </label>
      <select className="flex-1 p-2 border rounded-sm bg-white" {...props}>
        {options.map((opt) => (
          <option key={opt.label} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserDropdown;
