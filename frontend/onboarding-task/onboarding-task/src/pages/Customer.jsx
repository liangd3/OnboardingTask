import  { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import CreateUpdatePopup from '../components/CreateUpdatePopup';
import MakeSurePopup from '../components/MakeSurePopup';
import { Button } from 'semantic-ui-react';
import { addCustomer, deleteCustomer, editCustomer, getAllCustomer, getCustomer } from '../services/CustomerService';


function Customer() {

    const [makeSurePopup, setMakeSurePopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [dataTableData, setDataTableData] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(undefined);
    const [openCreateUpdatePopup, setOpenCreateUpdatePopup] = useState(false);
 
    useEffect(() => {
        loadCustomer();
      }, []);
    
    async function loadCustomer() {
        const customers = await getAllCustomer();
        setDataTableData(customers);
    }
    
    const toggleCreateUpdatePopup = () => {
        setOpenCreateUpdatePopup(!openCreateUpdatePopup);
    };

    const onCreateButtonClick = () => {
        setDataToEdit(undefined);
        setOpenCreateUpdatePopup(true);
      };

    const CreateUpdatePopupSubmit = async (formObject, isUpdate) => {
        if (isUpdate) {
            const response = await editCustomer(formObject.id, formObject);
            if (response === false) return false;
            await loadCustomer();
            return true;
        } else {
            const response = await addCustomer(formObject);
            if (response === false) return false;
            await loadCustomer();
            return true;
        }
    };

    const onEditDataTable = async (id) => {
        const customer = await getCustomer(id);
        setDataToEdit(customer);
        setOpenCreateUpdatePopup(true);
      };

    const onDeleteDataTable = (id) => {
        setMakeSurePopup(true);
        setSelectedId(id);
      };

    const onDeleteConfirmed = async () => {
        await deleteCustomer(selectedId);
        setMakeSurePopup(false);
        setSelectedId(null);
        await loadCustomer();
      };

    const dataTableColumns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Address', accessor: 'address' },
    ];

    const createUpdatePopupFields = [
        {
          name: 'name',
          label: 'Name',
          placeholder: 'Enter customer name',
          type: 'text',
        },
        {
          name: 'address',
          label: 'Address',
          placeholder: 'Enter address',
          type: 'text',
        },
    ];


    return (
        <>
          <Button color="blue" onClick={onCreateButtonClick}>
            Create Customer
          </Button>
          <MakeSurePopup
            open={makeSurePopup}
            setOpenState={setMakeSurePopup}
            onDelete={onDeleteConfirmed}
          />
          <CreateUpdatePopup
            open={openCreateUpdatePopup}
            onClose={toggleCreateUpdatePopup}
            data={dataToEdit}
            formFields={createUpdatePopupFields}
            onSubmit={CreateUpdatePopupSubmit}
          />
          <DataTable
            data={dataTableData}
            columns={dataTableColumns}
            onEdit={onEditDataTable}
            onDelete={onDeleteDataTable}
          />
        </>
      );
}

export default Customer;