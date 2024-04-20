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
    

    const loadCustomer = async () => {
      try {
        const customers = await getAllCustomer();
        setDataTableData(customers);
        }
      catch (error) {
          console.error("Issue with retrieving all customers:", error.message);
        }
    }
    
    const toggleCreateUpdatePopup = () => {
        setOpenCreateUpdatePopup(!openCreateUpdatePopup);
    };

    const onCreateButtonClick = () => {
        setDataToEdit(undefined);
        setOpenCreateUpdatePopup(true);
      };

    const onCreateUpdatePopupSubmit = async (formObject, isUpdate) => {
      try {
          if (isUpdate) {
              const response = await editCustomer(formObject.id, formObject);
              if (response == false) {
                return false;
              } else {
                await loadCustomer();
                return true;
              };
          } else {
              const response = await addCustomer(formObject);
              if (response == false) {
                return false;
              } else {
              await loadCustomer();
              return true;
              };
          }
      }
      catch (error) {
        console.error("Issue with submission:", error.message);
      }
    };

    const onEditDataTable = async (id) => {
      if (!id) {
        console.error("id doesn't contain value")
        return false;}

      try {
        const customer = await getCustomer(id);
        setDataToEdit(customer);
        setOpenCreateUpdatePopup(true);
      }
      catch (error) {
        console.error("Issue with editting:", error.message);
      }
      };

    const onDeleteDataTable = (id) => {
      if (!id) {
        console.error("id doesn't contain value")
        return false;}

        setMakeSurePopup(true);
        setSelectedId(id);
      };

    const onDeleteConfirmed = async () => {
      if (!selectedId) {
        console.error("selectedId doesn't contain value")
        return false;}

        try {
          await deleteCustomer(selectedId);
          setMakeSurePopup(false);
          setSelectedId(null);
          await loadCustomer();
        }
        catch (error) {
          console.error("Issue with deleting:", error.message);
        }
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
            onSubmit={onCreateUpdatePopupSubmit}
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