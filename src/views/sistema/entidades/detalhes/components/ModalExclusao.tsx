import { Dialog } from "@/components/ui";
import Button from "@/components/ui/Button";

type ConfirmDeleteModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title = "Remover item", message }: ConfirmDeleteModalProps) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <h4>{title}</h4>
            <p className="mt-4">{message}</p>
            <div className="flex justify-end mt-4 space-x-2">
                <Button variant="default" onClick={onClose}>Cancelar</Button>
                <Button variant="solid" onClick={onConfirm}>Remover</Button>
            </div>
        </Dialog>
    );
};

export default ConfirmDeleteModal;
