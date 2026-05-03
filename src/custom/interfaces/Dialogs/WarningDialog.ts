export interface WarningDialogProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    items: SelectedItem[];
    onClose: () => void;
    onComplete: (itemIds: any[]) => void;
}

export interface SelectedItem {
    id: string | number;
    name: string
}