import React from "react";
import { useForm, useWatch } from "react-hook-form";

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

import { enumRoles, enumMemberStatus } from "@/shared/utils/constant";

const defaultValues = {
  lastName: "",
  firstName: "",
  username: "",
  email: "",
  organization: 0,
  password: "",
  userStatus: "",
  avatar: "",
  role: "",
};

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

const memberStatus = [
  {
    label: "Active",
    value: enumMemberStatus.ACTIVE,
  },
  {
    label: "Inactive",
    value: enumMemberStatus.INACTIVE,
  },
];

export const EditMember = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const watchFieldsInModalCreateMember = () => {
    let isEnable = false;

    const field = useWatch({ control });
    if (field?.role && field?.userStatus) {
      isEnable = false;
    } else {
      isEnable = true;
    }
    return isEnable;
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (error) {}
  };

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
            <ButtonCustomize variant="contained">Reset Password</ButtonCustomize>
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
                    defaultValue="#1"
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
                    defaultValue="#1"
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
                    defaultValue="#1"
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
                    defaultValue="#1"
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
                      <Select {...field} fullWidth size="small">
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
                    defaultValue="#1"
                  />
                </EditMemberInfoItemValue>
              </EditMemberInfoItem>
            </EditMemberInfoRow>

            <EditMemberInfoRow>
              <EditMemberInfoItem>
                <EditMemberInfoItemTitle props="disabled">
                  Gender <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    id="standard-input"
                    variant="standard"
                    defaultValue="Male"
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
                    defaultValue="#1"
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
                  <ControllerInput
                    control={control}
                    errors={errors}
                    fieldNameErrorMessage="Status Member"
                    fieldName="userStatus"
                    required={true}
                  >
                    {(field) => (
                      <Select {...field} fullWidth size="small">
                        {memberStatus.map((option) => (
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
                  Seniorty <span style={{ color: "red" }}>*</span>
                </EditMemberInfoItemTitle>
                <EditMemberInfoItemValue>
                  <TextField
                    disabled
                    id="standard-input"
                    variant="standard"
                    defaultValue="#1"
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
