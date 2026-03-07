export interface WarningDialogProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    items: DeleteItem[];
    onClose: () => void;
    onComplete: (itemIds: any[]) => void;
}

export interface DeleteItem {
    id: string | number;
    name: string
}