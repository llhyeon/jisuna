import { Checkbox } from "@/components/ui/checkbox";
import { useId } from "react";

interface Props {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function CheckboxItem({ label, checked, onCheckedChange }: Props) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default CheckboxItem;
