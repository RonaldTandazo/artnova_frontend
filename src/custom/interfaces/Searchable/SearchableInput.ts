import { SelectOptions } from "../General/GeneralInterfaces";

export interface SearchableInputProps {
    placeholder?: string;
    options?: SelectOptions[];
    onSelect: (option: SelectOptions, action: "add" | "remove") => void;
}