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
        const stores = await getAllStores();
        setDataTableData(stores);
    };
    
    const toggleCreateUpdatePopup = () => {
        setOpenCreateUpdatePopup(!openCreateUpdatePopup);
    };

    const onCreateButtonClick = () => {
        setDataToEdit(undefined);
        setOpenCreateUpdatePopup(true);
      };

    const CreateUpdatePopupSubmit = async (formObject, isUpdate) => {
        if (isUpdate) {
            const response = await editStore(formObject.id, formObject);
            if (response === false) return false;
            await loadStore();
            return true;
        } else {
            const response = await addStore(formObject);
            if (response === false) return false;
            await loadStore();
            return true;
        }
    };

    const onEditDataTable = async (id) => {
        const store = await getStore(id);
        setDataToEdit(store);
        setOpenCreateUpdatePopup(true);
      };

    const onDeleteDataTable = (id) => {
        setMakeSurePopup(true);
        setSelectedId(id);
      };

    const onDeleteConfirmed = async () => {
        await deleteStore(selectedId);
        setMakeSurePopup(false);
        setSelectedId(null);
        await loadStore();
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

export default Store;