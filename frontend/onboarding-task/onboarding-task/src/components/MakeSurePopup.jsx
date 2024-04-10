import { Button, Modal, ModalHeader, ModalContent, ModalActions, ModalDescription } from 'semantic-ui-react';

function CreatePopup({ open, setOpenState, onDelete }) {
    return (
        <Modal 
        onClose={() => setOpenState(false)}
        onOpen={() => setOpenState(true)}
        open={open}
        >
            <ModalHeader>Delete</ModalHeader>
            <ModalContent>
                <ModalDescription>
                    Are you sure you want to delete?
                </ModalDescription>
            </ModalContent>
            <ModalActions>
            <Button color="black" onClick={() => setOpenState(false)}>
                Cancel
            </Button>
            <Button
            content="Delete"
            labelPosition="right"
            icon="delete"
            onClick={onDelete}
            negative
            />
            </ModalActions>
        </Modal>
    );
}

export default CreatePopup;