import  { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import CreateUpdatePopup from '../components/CreateUpdatePopup';
import MakeSurePopup from '../components/MakeSurePopup';
import { Button } from 'semantic-ui-react';
import { addStore, deleteStore, editStore, getAllStores, getStore } from '../services/StoreService';


function Store() {

    const [makeSurePopup, setMakeSurePopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [dataTableData, setDataTableData] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(undefined);
    const [openCreateUpdatePopup, setOpenCreateUpdatePopup] = useState(false);
 
    useEffect(() => {
        loadStore();
      }, []);
    
    const loadStore = async () => {
      try {
        const stores = await getAllStores();
        setDataTableData(stores);
      }
      catch (error) {
          console.error("Issue with retrieving all stores:", error.message);
        }
    };
    
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
            const response = await editStore(formObject.id, formObject);
              if (response == false) {
                return false;
              } else {
                await loadStore();
                return true;
              };
        } else {
            const response = await addStore(formObject);
              if (response == false) {
                return false;
              } else {
              await loadStore();
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
        const store = await getStore(id);
        setDataToEdit(store);
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
        await deleteStore(selectedId);
        setMakeSurePopup(false);
        setSelectedId(null);
        await loadStore();
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
          placeholder: 'Enter store name',
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
            Create Store
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

export default Store;