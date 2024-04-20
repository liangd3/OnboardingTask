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
      try {
        const products = await getAllProducts();
        setDataTableData(products);
      }
      catch (error) {
          console.error("Issue with retrieving all products:", error.message);
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
            const response = await editProduct(formObject.id, formObject);
              if (response == false) {
                return false;
              } else {
                await loadProduct();
                return true;
              };
        } else {
            const response = await addProduct(formObject);
              if (response == false) {
                return false;
              } else {
              await loadProduct();
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
        const product = await getProduct(id);
        setDataToEdit(product);
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
          await deleteProduct(selectedId);
          setMakeSurePopup(false);
          setSelectedId(null);
          await loadProduct();
        }
        catch (error) {
          console.error("Issue with deleting:", error.message);
        }
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

export default Product;