import React from "react";
import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
} from "@/shared/components";
import styled from "styled-components";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ORDER_DIRECTION } from "@/shared/utils/constant";

const TableHeaderCellWithAction = ({
  headCell,
  children,
  sort,
  toggleSort,
}) => {
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <TableSortLabel hideSortIcon={true} sx={{ paddingBottom: 1 }}>
          <strong>{headCell.label}</strong>
        </TableSortLabel>
        {headCell.hasSortIcon && (
          <IconButton
            onClick={() => toggleSort(headCell.id)}
            sx={{ padding: 0 }}
          >
            {sort[headCell.id] === ORDER_DIRECTION.asc ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        )}
      </Box>
      <Box>{children}</Box>
    </>
  );
};

const TableHeadCell = styled(TableCell)`
  &.MuiTableCell-root {
    border: none;
  }
`;

const TableHeader = styled(TableHead)(() => ({
  background: "F1F3F4",
  "& th:first-child": {
    borderRadius: `10px 0px 0px 10px`,
  },
  "& th:last-child": {
    borderRadius: `0px 10px 10px 0px`,
  },
}));

export const EnhancedTableHeader = ({
  onSelectAllClick,
  numSelected,
  rowCount,
  sort,
  headCells,
  hasCheckList,
  toggleSort,
}) => {
  return (
    <TableHeader>
      <TableRow style={{ verticalAlign: "baseline" }}>
        {hasCheckList && (
          <TableHeadCell width="2%" padding="none">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllClick(event)}
            />
          </TableHeadCell>
        )}
        {headCells.map((headCell) => {
          const { optionComponent: Child } = headCell;
          return (
            <TableHeadCell
              style={{ minWidth: headCell.width }}
              width={headCell.width}
              key={headCell.id}
              align="left"
            >
              <TableHeaderCellWithAction
                headCell={headCell}
                sort={sort}
                toggleSort={toggleSort}
              >
                {Child && <Child headCell={headCell} />}
              </TableHeaderCellWithAction>
            </TableHeadCell>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};

export default EnhancedTableHeader;
