import React, { useEffect, useState, useMemo } from 'react';
import { EnhancedTableHeader } from "./TableHeader";
import {
     Checkbox,
     TablePagination,
     Paper,
     Table,
     TableContainer,
     TableBody,
     TableRow,
     TableCell,
     CircularProgress,
     Box,
     MenuItem,
     Select,
     NoDataAvailable,
   } from "@/shared/components";
   
   export const CommonTable = ({
     dataList,
     selected,
     hasPagination = true,
     hasCheckList = true,
     sort,
     headCells,
     handleSelectAllClick,
     handleSelect,
     totalRecord,
     onChangePagination,
     toggleSort,
     maxHeight,
     children,
     loading = false,
     draggable = false,
     setHeadCells = () => {},
     paging = { page: 1, size: 10 },
     customTableBody,
   }
   ) => {
     const [page, setPage] = useState(paging?.page - 1 || 0);
     const [rowsPerPage, setRowsPerPage] = useState(paging?.size || 10);
     const [currentPageDropdownPage, setCurrentPageDropdownPage] = useState(1);

     const handleChangePage = (event, newPage) => {
          onChangePagination({ page: newPage + 1, size: rowsPerPage });
          setPage(newPage);
     };

     const handleChangeRowsPerPage = (event) => {
          onChangePagination({ page: 1, size: parseInt(event.target.value, 10) });
      
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        };

     const isSelected = (id) => selected?.indexOf(id) !== -1;

     const handleSort = (key) => {
          return toggleSort(key, { page: page + 1, size: rowsPerPage });
     };
      
     useEffect(() => {
          setPage(paging?.page - 1);
          setRowsPerPage(paging?.size);
     }, [paging]);

     const currentPageList = useMemo(
          () => Array.from({ length: Math.ceil((totalRecord ?? 0) / rowsPerPage) }, (_, idx) => `${idx + 1}`),
          [totalRecord, rowsPerPage],
     );

      return (
    <>
      <TableContainer style={{ boxShadow: "none", maxHeight: maxHeight || "unset" }} component={Paper}>
        <Table stickyHeader={!!maxHeight} sx={{ minWidth: 650 }}>
          <EnhancedTableHeader
            toggleSort={handleSort}
            headCells={headCells}
            hasCheckList={hasCheckList}
            sort={sort}
            numSelected={selected?.length || 0}
            onSelectAllClick={handleSelectAllClick}
            rowCount={dataList.length}
            draggable={draggable}
            setHeadCells={setHeadCells}
          />
            <TableBody>
              {!loading &&
                dataList.map((row, index) => {
                  const isItemSelected = hasCheckList ? isSelected(row.id) : false;
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      {hasCheckList && (
                        <TableCell width="3%" padding="none">
                          <Checkbox
                            color="secondary"
                            onClick={event => (handleSelect ? handleSelect(event, row.id || row.Id) : "")}
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                      )}
                      {children(row)}
                    </TableRow>
                  );
                })}
            </TableBody>
        </Table>
        {loading && (
          <Box my={10} textAlign="center">
            <CircularProgress color="inherit" size={30} />
          </Box>
        )}
        {!loading && dataList.length === 0 && <NoDataAvailable />}
      </TableContainer>
      {hasPagination && (
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Box display="flex" alignItems="baseline">
            <Box mr={3} sx={{ fontSize: 14 }} my="14px">
              <span>Current page: </span>
              <Select
                sx={{ pl: 2, fontSize: 14 }}
                disableUnderline
                value={page + 1}
                onChange={e => handleChangePage(e, Number(e.target.value) - 1)}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 150 },
                    onScroll: (event) => {
                      const listboxNode = event.currentTarget;
                      if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
                        setCurrentPageDropdownPage(page => page + 1);
                      }
                    },
                  },
                }}
                variant="standard"
              >
                {currentPageList.slice(0, currentPageDropdownPage * 50).map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100]}
            component="div"
            count={totalRecord || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </>
  );

   }

   export default CommonTable;
   
   