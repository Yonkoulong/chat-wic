import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import {
  MemberContainer,
  LinkStyled,
  MemberContent,
  MemberContentHead,
  MemberContentTitle,
  MemberContentAction,
  MemberContentBody,
} from "./Members.styles";
import { ButtonCustomize } from "@/shared/components/Button";
import { CommonTable } from "@/shared/components";

const headCellMembersListing = [
  {
    id: "name",
    label: "Name",
    optionComponent: false,
    hasSortIcon: true,
    width: "40%",
  },
  {
    id: "members",
    label: "Members",
    optionComponent: false,
    hasSortIcon: false,
    width: "40%",
  },
  {
    id: "actions",
    label: "Actions",
    hasSortIcon: false,
    width: "15%",
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
                    <div >{member.name}</div>
                </TableCell>
                <TableCell>
                  <div>{member?.totalAgents || "-"}</div>
                </TableCell>
                <TableCell>
                  <div>kaka</div>
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
