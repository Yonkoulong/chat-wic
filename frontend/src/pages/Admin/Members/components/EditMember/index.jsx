import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";

import {
  TextField,
  ButtonCustomize,
  Box,
  ControllerInput,
  MenuItem,
  Select,
} from "@/shared/components";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { primaryColor, blackColor } from "@/shared/utils/colors.utils";
import { toast } from "react-toastify";

import {
  LinkStyled,
  EditMemberContainer,
  EditMemberContent,
  EditMemberContentHead,
  EditMemberContentTitle,
  EditMemberContentInfo,
  EditMemberInfoRow,
  EditMemberInfoItem,
  EditMemberInfoItemTitle,
  EditMemberInfoItemValue,
  EditMemberAction,
  EditMemberContentForm,
  EditMemberContentHeadItem,
} from "./EditMember.styles";

import {
  enumRoles,
  formatDate,
} from "@/shared/utils/constant";
import { getMemberDetail, putUserDetail } from "@/services/member.service";

const roles = [
  {
    label: "Staff",
    value: enumRoles.STAFF,
  },
  {
    label: "Project Manager",
    value: enumRoles.PROJECT_MANAGER,
  },
];

export const EditMember = () => {
  const { id } = useParams();
  const [memberInfo, setMemberInfo] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const watchFieldsInModalCreateMember = () => {
    let isEnable = false;

    const field = useWatch({ control });
    if (field?.role) {
      isEnable = false;
    } else {
      isEnable = true;
    }
    return isEnable;
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await getMemberDetail(id);
        if (resp) {
          setMemberInfo(resp?.data?.content);
          setValue('role', resp?.data?.content?.role);
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.content;
        toast.error(errorMessage);
      }
    })();
  }, []);

  const onSubmit = async (data) => {
    try {
      if(memberInfo) {

        const payload = {
          ...memberInfo, role: data?.role
        }

        const resp = await putUserDetail(payload);

        if(resp) {
          toast.success('Update member infor successfully!');
        }
      }

    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    }
  };

  const handleResetPassword = () => {
    
  }
  
  return (
    <EditMemberContainer>
      <Breadcrumbs aria-label="breadcrumb">
        <LinkStyled>Admin</LinkStyled>
        <LinkStyled>Members</LinkStyled>
        <LinkStyled sx={{ fontWeight: "bold", color: blackColor }}>
          Profile
        </LinkStyled>
      </Breadcrumbs>

      <EditMemberContent>
        <EditMemberContentHead>
          <EditMemberContentHeadItem>
            <ArrowCircleLeftIcon
              sx={{
                fontSize: "30px",
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
            />
            <EditMemberContentTitle variant="h4" component="h3">
              Edit Member
            </EditMemberContentTitle>
          </EditMemberContentHeadItem>

          <EditMemberContentHeadItem>
            <ButtonCustomize variant="contained">
              Reset Password
            </ButtonCustomize>
          </EditMemberContentHeadItem>
        </EditMemberContentHead>

        <EditMemberContentForm onSubmit={handleSubmit(onSubmit)}>
          <EditMemberContentInfo>
            <EditMemberInfoRow>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  EmployeeID <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={memberInfo?.id || "-"}
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  First Name <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={memberInfo?.firstName || "-"}
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
            </EditMemberInfoRow>

            <EditMemberInfoRow>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  Email <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={memberInfo?.email || "-"}
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  Last Name <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={memberInfo?.lastName || "-"}
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
            </EditMemberInfoRow>

            <EditMemberInfoRow>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle>
                  Role <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <ControllerInput
                    control={control}
                    errors={errors}
                    fieldNameErrorMessage="Role"
                    fieldName="role"
                    required={true}
                  >
                    {(field) => (
                      <Select {...field} fullWidth size="small" value={memberInfo?.role || field.value}>
                        {roles.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </ControllerInput>
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  Date of Birth <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={formatDate(memberInfo?.updatedAt) || "-"}
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
            </EditMemberInfoRow>

            <EditMemberInfoRow>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  Username <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={memberInfo?.username || "-"}
                    disabled
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  Beginning Date <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={formatDate(memberInfo?.createdAt) || "-"}
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
            </EditMemberInfoRow>

            <EditMemberInfoRow>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle>
                  Status <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={memberInfo?.userStatus || "-"}
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  Seniorty <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    fullWidth
                    value={formatDate(memberInfo?.createdAt) || "-"}
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
            </EditMemberInfoRow>
          </EditMemberContentInfo>
          <EditMemberAction>
            <Box mr={2}>
              <ButtonCustomize
                variant="contained"
                type="submit"
                disabled={watchFieldsInModalCreateMember()}
              >
                Update
              </ButtonCustomize>
            </Box>
            <Box>
              <ButtonCustomize variant="outlined">Cancel</ButtonCustomize>
            </Box>
          </EditMemberAction>
        </EditMemberContentForm>
      </EditMemberContent>
    </EditMemberContainer>
  );
};
