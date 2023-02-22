import React, { useEffect, useState } from "react";
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
import { CommonTable, ButtonCustomize, Typography, IconButton, TableCell, Box } from "@/shared/components";
import { MemberSearchField } from "./components/MemberSearchField";
import { getMembersByOrganizeId } from "@/services/member.service"
import { MAX_HEIGHT_TABLE, getDataList, formatDate } from "@/shared/utils/constant";

const getHeadCellMembersListing = (props) => [
  {
    id: "_id",
    label: "Member ID",
    optionComponent: () => (<MemberSearchField placeHolder="Search" fieldName="id" {...props}/>),
    hasSortIcon: false,
    width: "18%",
  },
  {
    id: "email",
    label: "Email",
    optionComponent: () => (<MemberSearchField placeHolder="Search" fieldName="email" {...props}/>),
    hasSortIcon: false,
    width: "20%",
  },
  {
    id: "name",
    label: "Name",
    optionComponent: () => (<MemberSearchField placeHolder="Search" fieldName="username" {...props}/>),
    hasSortIcon: false,
    width: "20%",
  },
  {
    id: "createdAt",
    label: "Beginning Date",
    optionComponent: () => (<MemberSearchField placeHolder="Search" fieldName="createdAt" {...props}/>),
    hasSortIcon: false,
    width: "20%",
  },
  {
    id: "userStatus",
    label: "Status",
    optionComponent: () => (<MemberSearchField placeHolder="Search" fieldName="userStatus" {...props}/>),
    hasSortIcon: false,
    width: "15%",
  },
  {
    id: "actions",
    label: "Actions",
    optionComponent: false,
    hasSortIcon: false,
    width: "5%",
  },
]

const organizeId = "63e9e5d0a831c1390cd043db";

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [membersSelected, setMembersSelected] = useState([]);
  const [totalRecord, setTotalRecord] = useState(10);
  const [payloadRequest, setPayloadRequest] = useState({
    organizeId,
    id: "",
    email : "",
    pagination : { page : 1, size : 10 }
  });
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    setLoading(true);
    (async() => {
     try{
      const { content, paging } = await getDataList(getMembersByOrganizeId, payloadRequest);
      setMembers(content);
      setPayloadRequest({...payloadRequest,pagination : {page : paging.page, size : paging.size}});
      setTotalRecord(paging?.totalRecord || 10);
     }finally{
      setLoading(false);
     }
    })()
  }, [])

  const toggleSort = () => {};

  const handleCheckAllMember = (event) => {
    const isChecked = event?.target?.checked;
    if(isChecked){
      const selected = members.map(member => member?._id)
      setMembersSelected(selected);
    }else{
      setMembersSelected([])
    }
  };

  const onChangePagination = async({page, size}) =>{
    const newPayloadRequest = {...payloadRequest, pagination : {page, size}};
    const { content, paging } = await getDataList(getMembersByOrganizeId, newPayloadRequest);
    setMembers(content);
    setPayloadRequest({...payloadRequest,pagination : {page : paging.page, size : paging.size}});
    setTotalRecord(paging?.totalRecord || 10);
  };
  
  const handleSelectMember = (_event, rowId) => {
    let newMembersSelected = [];

    if(membersSelected.includes(rowId)){
      newMembersSelected = membersSelected.filter(id => id !== rowId)
    }else{
      newMembersSelected = [...membersSelected, rowId]
    }

    setMembersSelected(newMembersSelected);
  };

  const handleSearch = async (value, fieldName) => {
    const newPayloadRequest = {...payloadRequest, [fieldName] : value || ""};
      const { content, paging } = await getDataList(getMembersByOrganizeId, newPayloadRequest);
      setMembers(content);
      setPayloadRequest({...newPayloadRequest,pagination : {page : paging.page, size : paging.size}});
      setTotalRecord(paging?.totalRecord || 10);
  }

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
            <Box pr={2}><ButtonCustomize variant="contained">Delete Members</ButtonCustomize></Box>
            <Box><ButtonCustomize variant="contained">Create Members</ButtonCustomize></Box>
          </MemberContentAction>
        </MemberContentHead>

        <MemberContentBody>
        <CommonTable
          hasCheckList={true}
          sort={{}}
          hasPagination={true}
          headCells={getHeadCellMembersListing({handleSearch, payloadRequest})}
          dataList={members}
          selected={membersSelected}
          handleSelect={handleSelectMember}
          handleSelectAllClick={handleCheckAllMember}
          toggleSort={toggleSort}
          totalRecord={totalRecord}
          paging={ { page: payloadRequest?.pagination?.page || 1, size: payloadRequest?.pagination?.size || 10 }}
          maxHeight={MAX_HEIGHT_TABLE}
          loading={loading}
          onChangePagination={onChangePagination}
        >
          {(member) => {
            return (
              <>
                <TableCell>
                  <Typography variant="body2">{member?._id || "_"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{member?.email || "-"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{member?.username || "-"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{formatDate(member?.createdAt) || "-"}</Typography>
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
