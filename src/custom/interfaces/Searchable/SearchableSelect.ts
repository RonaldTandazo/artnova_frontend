import { SelectOptions } from "../general/GeneralInterfaces";

export interface SearchableSelectProps {
    disabled?: boolean;
    placeholder?: string;
    options?: SelectOptions[];
    field: any;
    multiple?: boolean;
    defaultValue?: any;
}