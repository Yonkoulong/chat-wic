import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import {
  MemberContainer,
  LinkStyled,
  MemberContent,
  MemberContentHead,
  MemberContentTitle,
  MemberContentAction,
  MemberContentBody,
} from "./Members.styles";
import { CommonTable, ButtonCustomize, Typography, IconButton } from "@/shared/components";
import { MemberSearchField } from "./components/MemberSearchField";

const headCellMembersListing = [
  {
    id: "_id",
    label: "Member ID",
    optionComponent: (props) => (<MemberSearchField placeHolder="Search" fieldName="_id" {...props}/>),
    hasSortIcon: true,
    width: "20%",
  },
  {
    id: "email",
    label: "Email",
    optionComponent: (props) => (<MemberSearchField placeHolder="Search" fieldName="email" {...props}/>),
    hasSortIcon: true,
    width: "30%",
  },
  {
    id: "createAt",
    label: "Beginning Date",
    optionComponent: (props) => (<MemberSearchField placeHolder="Search" fieldName="createAt" {...props}/>),
    hasSortIcon: true,
    width: "20%",
  },
  {
    id: "userStatus",
    label: "Member Status",
    optionComponent: (props) => (<MemberSearchField placeHolder="Search" fieldName="userStatus" {...props}/>),
    hasSortIcon: true,
    width: "20%",
  },
  {
    id: "actions",
    label: "Actions",
    optionComponent: false,
    hasSortIcon: false,
    width: "10%",
  },
]


export const Members = () => {

  const toggleSort = () => {};

  const handleCheckAllMember = () => {};
  
  const handleSelectMember = () => {};

  return (
    <MemberContainer>
      <Breadcrumbs aria-label="breadcrumb">
        <LinkStyled>Admin</LinkStyled>
        <LinkStyled>Members</LinkStyled>
      </Breadcrumbs>

      <MemberContent>
        <MemberContentHead>
          <MemberContentTitle>Members</MemberContentTitle>

          <MemberContentAction>
            <ButtonCustomize variant="contained">Delete Members</ButtonCustomize>
            <ButtonCustomize variant="contained">Create Members</ButtonCustomize>
          </MemberContentAction>
        </MemberContentHead>

        <MemberContentBody>
        <CommonTable
          hasCheckList={true}
          sort={{}}
          hasPagination={true}
          headCells={headCellMembersListing}
          dataList={[]}
          selected={[]}
          handleSelect={handleSelectMember}
          handleSelectAllClick={handleCheckAllMember}
          toggleSort={toggleSort}
          totalRecord={100}
          paging={ { page: 1, size: 10 }}
          maxHeight={700}
          loading={false}
        >
          {(member) => {
            return (
              <>
                <TableCell>
                    <Typography variant="body2">{member?._id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{member?.email || "-"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{member?.createAt || "-"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{member?.userStatus || "-"}</Typography>
                </TableCell>
                <TableCell>
                    <IconButton>
                        <DeleteOutlineIcon />
                    </IconButton>
                </TableCell>
              </>
            );
          }}
        </CommonTable>

        </MemberContentBody>
      </MemberContent>
    </MemberContainer>
  );
};
