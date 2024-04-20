import  { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import CreateUpdatePopup from '../components/CreateUpdatePopup';
import MakeSurePopup from '../components/MakeSurePopup';
import { Button } from 'semantic-ui-react';
import { addSale, deleteSale, editSale, getAllSales, getSale } from '../services/SalesService';
import { getAllCustomer } from '../services/CustomerService';
import { getAllProducts } from '../services/ProductService';
import { getAllStores } from '../services/StoreService';

function Sales() {

    const [makeSurePopup, setMakeSurePopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [dataTableData, setDataTableData] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(undefined);
    const [openCreateUpdatePopup, setOpenCreateUpdatePopup] = useState(false);

    const [customerDropdownSource, setCustomerDropdownSource] = useState([]);
    const [productDropdownSource, setProductDropdownSource] = useState([]);
    const [storeDropdownSource, setStoreDropdownSource] = useState([]);
 
    useEffect(() => {
        loadSale();
        loadDropdownSources();
      }, []);


    const loadDropdownSources = async () => {
      try {
        const customers = await getAllCustomer();
        const products = await getAllProducts();
        const stores = await getAllStores();

        setCustomerDropdownSource(formatDropdownSource(customers));
        setProductDropdownSource(formatDropdownSource(products));
        setStoreDropdownSource(formatDropdownSource(stores));
      }
      catch (error) {
          console.error("Issue with retrieving relative data:", error.message);
        }
    };


    const formatDropdownSource = (items) => {
        if (!items) {
          console.error("items doesn't contain anything");
          return [];
        }

        try {
          return items.map((item) => ({
          key: item.id,
          text: item.name,
          value: item.id,
          }));
        }
        catch (error) {
            console.error("Issue with retrieving relative data:", error.message);
          }
    };
        
    const loadSale = async () => {
      try {
        const sales = await getAllSales();
        
        if (!sales) {
          console.error("sales doesn't contain anything");
          return [];
        }

        const tableData = sales.map((s) => ({
          ...s,
          customer: s.customerName,
          product: s.productName,
          store: s.storeName,
          dateSold: s.dateSold.split('T')[0],
        }));
        setDataTableData(tableData);
      }
      catch (error) {
          console.error("Issue with retrieving sales:", error.message);
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
            const response = await editSale(formObject.id, formObject);
            if (response == false) {
              return false;
            } else {
              await loadProduct();
              return true;
            };
        } else {
            const response = await addSale(formObject);
              if (response == false) {
                return false;
              } else {
              await loadSale();
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
        const sale = await getSale(id);
        sale.dateSold = sale.dateSold.split('T')[0];
        setDataToEdit(sale);
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
        await deleteSale(selectedId);
        setMakeSurePopup(false);
        setSelectedId(null);
        await loadSale();
      }
      catch (error) {
        console.error("Issue with deleting:", error.message);
      }
      };

    const dataTableColumns = [
        { header: 'Product', accessor: 'product' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Store', accessor: 'store' },
        { header: 'Date Sold', accessor: 'dateSold' },
      ];

    const createUpdatePopupFields = [
        {
          name: 'productId',
          label: 'Product',
          placeholder: 'Select a product',
          type: 'dropdown',
          options: productDropdownSource,
        },
        {
          name: 'customerId',
          label: 'Customer',
          placeholder: 'Select a customer',
          type: 'dropdown',
          options: customerDropdownSource,
        },
        {
          name: 'storeId',
          label: 'Store',
          placeholder: 'Select a store',
          type: 'dropdown',
          options: storeDropdownSource,
        },
        { name: 'dateSold', label: 'Date Sold', placeholder: 'Enter date sold', type: 'date' },
      ];


    return (
        <>
          <Button color="blue" onClick={onCreateButtonClick}>
            Create Sale
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

export default Sales;