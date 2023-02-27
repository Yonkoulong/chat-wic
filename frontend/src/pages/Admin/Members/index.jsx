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
import {
  CommonTable,
  ButtonCustomize,
  Typography,
  IconButton,
  TableCell,
  Box,
} from "@/shared/components";
import { blackColor } from "@/shared/utils/colors.utils";
import { redirectTo } from "@/shared/utils/history";
import { MemberSearchField } from "./components/MemberSearchField";
import { ModalCreateMember } from "./components/CreateMemberModal";
import { getMembersByOrganizeId } from "@/services/member.service";
import {
  MAX_HEIGHT_TABLE,
  formatDate,
} from "@/shared/utils/constant";
import { useMemberStore } from "@/stores/MemberStore";
import { useAppStore } from "@/stores/AppStore";
import { PopUpConfirm } from '@/shared/components/Popup';

const getHeadCellMembersListing = (props) => [
  {
    id: "_id",
    label: "Member ID",
    optionComponent: () => (
      <MemberSearchField placeHolder="Search" fieldName="id" {...props} />
    ),
    hasSortIcon: false,
    width: "18%",
  },
  {
    id: "email",
    label: "Email",
    optionComponent: () => (
      <MemberSearchField placeHolder="Search" fieldName="email" {...props} />
    ),
    hasSortIcon: false,
    width: "20%",
  },
  {
    id: "name",
    label: "Name",
    optionComponent: () => (
      <MemberSearchField placeHolder="Search" fieldName="username" {...props} />
    ),
    hasSortIcon: false,
    width: "20%",
  },
  {
    id: "createdAt",
    label: "Beginning Date",
    optionComponent: null,
    hasSortIcon: false,
    width: "20%",
  },
  {
    id: "userStatus",
    label: "Status",
    optionComponent: () => (
      <MemberSearchField
        placeHolder="Search"
        fieldName="userStatus"
        {...props}
      />
    ),
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
];

const organizeId = "63e9e5d0a831c1390cd043db";

export const Members = () => {
  const { members, fetchMembers, paging, totalRecord, loading, setLoading} = useMemberStore((state) => state);
  const { userInfo } = useAppStore((state) => state);

  const [membersSelected, setMembersSelected] = useState([]);
  const [payloadRequest, setPayloadRequest] = useState({
    organizeId,
    id: "",
    email: "",
    paging: { page: 1, size: 10 },
  });
  const [openCreateMemberModal, setOpenCreateMemberModal] = useState(false);
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false)
;
  const handleClickOpenModalCreateMember = () => {
    setOpenCreateMemberModal(true);
  };

  const handleCloseOpenModalCreateMember = () => {
    setOpenCreateMemberModal(false);
  };

  useEffect(() => {
   setLoading(true);

    try {
      fetchMembers(payloadRequest);
      setPayloadRequest({
        ...payloadRequest,
        paging: { page: paging.page, size: paging.size },
      });
    } finally {
      //setLoading(false);
    }
  }, []);

  const toggleSort = () => {};

  const handleCheckAllMember = (event) => {
    const isChecked = event?.target?.checked;
    if (isChecked) {
      const selected = members.map((member) => member?._id);
      setMembersSelected(selected);
    } else {
      setMembersSelected([]);
    }
  };

  const onChangePagination = ({ page, size }) => {
    const newPayloadRequest = { ...payloadRequest, paging: { page, size } };
    fetchMembers(newPayloadRequest);
    console.log(newPayloadRequest);
    setPayloadRequest({
      ...payloadRequest,
      paging: { page: paging.page, size: paging.size },
    });
  };

  const handleSelectMember = (_event, rowId) => {
    let newMembersSelected = [];

    if (membersSelected.includes(rowId)) {
      newMembersSelected = membersSelected.filter((id) => id !== rowId);
    } else {
      newMembersSelected = [...membersSelected, rowId];
    }

    setMembersSelected(newMembersSelected);
  };

  const handleSearch = (value, fieldName) => {
    const newPayloadRequest = { ...payloadRequest, [fieldName]: value || "" };
    fetchMembers(newPayloadRequest);
    setPayloadRequest({
      ...newPayloadRequest,
      pagination: { page: paging.page, size: paging.size },
    });
  };

  return (
    <MemberContainer>
      <Breadcrumbs aria-label="breadcrumb">
        <LinkStyled>Admin</LinkStyled>
        <LinkStyled sx={{ fontWeight: "bold", color: blackColor }}>
          Members
        </LinkStyled>
      </Breadcrumbs>

      <MemberContent>
        <MemberContentHead>
          <MemberContentTitle>Members</MemberContentTitle>

          <MemberContentAction>
            <Box mr={2}>
              <ButtonCustomize
                variant="contained"
                disabled={membersSelected?.length < 1}
              >
                Delete Members
              </ButtonCustomize>
            </Box>
            <Box>
              <ButtonCustomize
                variant="contained"
                handleClick={handleClickOpenModalCreateMember}
              >
                Create Members
              </ButtonCustomize>
            </Box>
          </MemberContentAction>
        </MemberContentHead>

        <MemberContentBody>
          <CommonTable
            hasCheckList={true}
            sort={{}}
            hasPagination={true}
            headCells={getHeadCellMembersListing({
              handleSearch,
              payloadRequest,
            })}
            dataList={members}
            selected={membersSelected}
            handleSelect={handleSelectMember}
            handleSelectAllClick={handleCheckAllMember}
            toggleSort={toggleSort}
            totalRecord={totalRecord}
            paging={{
              page: payloadRequest?.paging?.page || 1,
              size: payloadRequest?.paging?.size || 10,
            }}
            maxHeight={MAX_HEIGHT_TABLE}
            loading={loading}
            onChangePagination={onChangePagination}
          >
            {(member) => {
              return (
                <>
                  <TableCell onClick={() => redirectTo(`/admin/members/${member?._id}`)} sx={{cursor: "pointer", userSelect: "none"}}>
                    <Typography variant="body2">
                      {member?._id || "_"}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => redirectTo(`/admin/members/${member?._id}`)} sx={{cursor: "pointer", userSelect: "none"}}>
                    <Typography>{member?.email || "-"}</Typography>
                  </TableCell>
                  <TableCell onClick={() => redirectTo(`/admin/members/${member?._id}`)} sx={{cursor: "pointer", userSelect: "none"}}>
                    <Typography>{member?.username || "-"}</Typography>
                  </TableCell>
                  <TableCell onClick={() => redirectTo(`/admin/members/${member?._id}`)} sx={{cursor: "pointer", userSelect: "none"}}>
                    <Typography>
                      {formatDate(member?.createdAt) || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => redirectTo(`/admin/members/${member?._id}`)} sx={{cursor: "pointer", userSelect: "none"}}>
                    <Typography>{member?.userStatus || "-"}</Typography>
                  </TableCell>
                  <TableCell >
                    <IconButton>
                      <DeleteOutlineIcon onClick={() => setOpenPopupConfirm(true)}/>
                    </IconButton>
                  </TableCell>
                </>
              );
            }}
          </CommonTable>
        </MemberContentBody>
      </MemberContent>
      {/* Popup confirm when delete member */}
      <PopUpConfirm 
        open={openPopupConfirm}
        onCancel={() => console.log("cancel")}
        onConfirm={() => console.log("test")}
        content="Are you sure to delete member!"
      />
      {/* modal create member */}
      <ModalCreateMember
        open={openCreateMemberModal}
        onClose={setOpenCreateMemberModal}
      />
    </MemberContainer>
  );
};
