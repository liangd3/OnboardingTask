import { useState } from 'react';
import { Table, Button, Segment, Pagination, Dropdown, Icon } from 'semantic-ui-react';

function DataTable({ data, columns, onEdit, onDelete }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        return data.slice(startIndex, startIndex + pageSize);
      };

    const handlePaginationChange = (e, { activePage }) => {
        setCurrentPage(activePage);
    };

    const handlePageSizeChange = (e, { value }) => {
        setPageSize(value);
        setCurrentPage(1);
      };

    const renderTable = (data) => (
    <Table celled>
        <Table.Header>
        <Table.Row>
            {columns.map((column, index) => (
            <Table.HeaderCell key={index}>{column.header}</Table.HeaderCell>
            ))}
            <Table.HeaderCell>Action</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
        </Table.Row>
        </Table.Header>

        <Table.Body>
        {data.map((item, rowIndex) => (
            <Table.Row key={item.id || rowIndex}>
            {columns.map((column, colIndex) => (
                <Table.Cell key={colIndex}>
                {typeof column.accessor === 'function' ? column.accessor(item) : item[column.accessor]}
                </Table.Cell>
            ))}

            {onEdit && (
                <Table.Cell>
                <Button color="yellow" onClick={() => onEdit(item.id)}>
                    <Icon name='edit' /> EDIT
                </Button>
                </Table.Cell>
            )}

            {onDelete && (
                <Table.Cell>
                <Button color="red" onClick={() => onDelete(item.id)}>
                    <Icon name='delete' /> DELETE
                </Button>
                </Table.Cell>
            )}
            </Table.Row>
        ))}
        </Table.Body>
    </Table>
    );


    const pageData = getCurrentPageData();
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const pageSizeOptions = [
        { key: '5', value: 5, text: '5' },
        { key: '10', value: 10, text: '10' },
        { key: '20', value: 20, text: '20' },
    ];

    return (
        <>
          {totalItems > 0 ? (
            <>
              {renderTable(pageData)}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <Dropdown
                  selection
                  options={pageSizeOptions}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                />
                <Pagination
                  activePage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePaginationChange}
                />
              </div>
            </>
          ) : (
            <Segment textAlign="center" padded="very">
              Data not found
            </Segment>
          )}
        </>
      );
    
}


export default DataTable;