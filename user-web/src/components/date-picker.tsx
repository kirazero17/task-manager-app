import { PencilLine } from "lucide-react";

// Import components
import { Calendar } from "src/components/ui/calendar";
import {
  PopoverDialog,
  PopoverDialogContent,
  PopoverDialogTrigger,
} from "src/components/ui/popover-dialog";

type DatePickerProps = {
  TriggerContent: (() => JSX.Element) | JSX.Element;
  date: Date;
  setDate: any;
};

/**
 * Render float date picker
 * @param param0
 * @returns
 */
export default function DatePicker(props: DatePickerProps) {
  let Content = (
    <PencilLine className="cursor-pointer" color="gray" size="16px" />
  );

  if (typeof props.TriggerContent === "function") {
    Content = <props.TriggerContent />;
  } else if (typeof props.TriggerContent === "object") {
    Content = props.TriggerContent;
  }

  return (
    <PopoverDialog>
      <PopoverDialogTrigger asChild>{Content}</PopoverDialogTrigger>
      <PopoverDialogContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.date}
          onSelect={props.setDate}
          initialFocus
        />
      </PopoverDialogContent>
    </PopoverDialog>
  );
}
