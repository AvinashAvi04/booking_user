declare module "@env" {
  export const REACT_APP_BASE_URL: string;
}

declare module "../FieldLabel" {
  export const FieldLabel: React.FC<{ children: React.ReactNode }>;
}

declare module "../TimeDropdown" {
  interface TimeDropdownProps {
    value: Date;
    onTimeSelect: (time: string) => void;
    isVisible: boolean;
    onClose: () => void;
  }
  const TimeDropdown: React.FC<TimeDropdownProps>;
  export default TimeDropdown;
}

declare module "../DatePickerModal" {
  interface DatePickerModalProps {
    open: boolean;
    startDate: string;
    selectedDate: string;
    onClose: () => void;
    onChangeStartDate: (date: string) => void;
  }
  const DatePickerModal: React.FC<DatePickerModalProps>;
  export default DatePickerModal;
}
