import  { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import CreateUpdatePopup from '../components/CreateUpdatePopup';
import MakeSurePopup from '../components/MakeSurePopup';
import { Button } from 'semantic-ui-react';
import { addProduct, deleteProduct, editProduct, getAllProducts, getProduct } from '../services/ProductService';


function Product() {

    const [makeSurePopup, setMakeSurePopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [dataTableData, setDataTableData] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(undefined);
    const [openCreateUpdatePopup, setOpenCreateUpdatePopup] = useState(false);
 
    useEffect(() => {
        loadProduct();
      }, []);
    
    const loadProduct = async () => {
        const products = await getAllProducts();
        setDataTableData(products);
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
            const response = await editProduct(formObject.id, formObject);
            if (response === false) return false;
            await loadProduct();
            return true;
        } else {
            const response = await addProduct(formObject);
            if (response === false) return false;
            await loadProduct();
            return true;
        }
    };

    const onEditDataTable = async (id) => {
        const product = await getProduct(id);
        setDataToEdit(product);
        setOpenCreateUpdatePopup(true);
      };

    const onDeleteDataTable = (id) => {
        setMakeSurePopup(true);
        setSelectedId(id);
      };

    const onDeleteConfirmed = async () => {
        await deleteProduct(selectedId);
        setMakeSurePopup(false);
        setSelectedId(null);
        await loadProduct();
      };

    const dataTableColumns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Price', accessor: 'price' },
    ];

    const createUpdatePopupFields = [
        {
          name: 'name',
          label: 'Name',
          placeholder: 'Enter product name',
          type: 'text',
        },
        {
          name: 'price',
          label: 'Price',
          placeholder: 'Enter price',
          type: 'text',
        },
    ];


    return (
        <>
          <Button color="blue" onClick={onCreateButtonClick}>
            Create Product
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

export default Product;