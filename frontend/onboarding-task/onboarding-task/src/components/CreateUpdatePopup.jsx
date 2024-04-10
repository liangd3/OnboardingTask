import  { useState, useEffect } from 'react';
import { Button, Dropdown, Input, Modal, ModalHeader, ModalContent, ModalActions, ModalDescription, Form, FormField } from 'semantic-ui-react';

function CreateOrUpdatePopup({ open, onClose, onSubmit, data, formFields }) {

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (open) {
          setFormData(data || {});
        }
      }, [open, data]);

    const handleInputChange = (e, { name, value }) => {
    setFormData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
    };

    const handleSubmit = async () => {
        const isUpdate = data !== undefined;

        const response = await onSubmit(formData, isUpdate);

        if (response === true) {
          setFormData({});
          onClose();
        }
      };


    const renderField = (field) => {
        const { name, label, placeholder, type, options } = field;

        switch (type) {
        case 'text':
        case 'date':
            return (
            <FormField key={name}>
                <label>{label}</label>
                <Input placeholder={placeholder} type={type} name={name} value={formData[name] || ''} onChange={handleInputChange} />
            </FormField>
            );
        case 'dropdown':
            return (
            <FormField key={name}>
                <label>{label}</label>
                <Dropdown
                placeholder={placeholder}
                fluid
                selection
                options={options}
                value={formData[name]}
                onChange={handleInputChange}
                name={name}
                />
            </FormField>
            );
        default:
            return null;
        }
    };


  return (
    <Modal onClose={onClose} open={open}>
      <ModalHeader>{data ? "Update" : "Create"}</ModalHeader>
      <ModalContent>
        <ModalDescription>
          <Form onSubmit={handleSubmit}>
            {formFields.map(renderField)} 
          </Form>
        </ModalDescription>
      </ModalContent>
      <ModalActions>
        <Button color="black" onClick={() => { setFormData({}); onClose(); }}>
          Cancel
        </Button>
        <Button content={data ? "Update" : "Create"} labelPosition="right" icon="checkmark" onClick={handleSubmit} positive />
      </ModalActions>
    </Modal>
  );
}


export default CreateOrUpdatePopup;