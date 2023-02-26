import React from "react";
import { useForm, useWatch } from "react-hook-form";

import { TextField, ButtonCustomize, Box } from "@/shared/components";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { primaryColor } from '@/shared/utils/colors.utils';


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
} from "./EditMember.styles";
import { blackColor } from '@/shared/utils/colors.utils'

const defaultValues = {
  lastName: "",
  firstName: "",
  username: "",
  email: "",
  organization: 0,
  password: "",
  userStatus: "",
  avatar: "",
  role: ""
}

export const EditMember = () => {

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const watchFieldsInModalCreateMember = () => {
    let isEnable = false;

    const field = useWatch({control});
    if(field?.role && field?.userStatus && field?.password) {
      isEnable = false;
    } else {
      isEnable = true;
    }
    return isEnable;
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
          <ArrowCircleLeftIcon sx={{
              fontSize: "30px",
             ':hover': {
              color: primaryColor,
              cursor: "pointer"
            }
          }}/>
          <EditMemberContentTitle variant="h4" component="h3">Edit Member</EditMemberContentTitle>
        </EditMemberContentHead>

        <EditMemberContentInfo>
          <EditMemberInfoRow>
            <EditMemberInfoItem>
              <EditMemberInfoItemTitle props="disabled">
                EmployeeID <span style={{ color: 'red' }}>*</span>
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
                First Name <span style={{ color: 'red' }}>*</span>
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
                Email <span style={{ color: 'red' }}>*</span>
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
                Last Name <span style={{ color: 'red' }}>*</span>
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
                Role <span style={{ color: 'red' }}>*</span>
              </EditMemberInfoItemTitle>
              <EditMemberInfoItemValue>
                <TextField
                  id="standard-input"
                  variant="standard"
                  defaultValue="#1"
                />
              </EditMemberInfoItemValue>
            </EditMemberInfoItem>
            <EditMemberInfoItem>
              <EditMemberInfoItemTitle props="disabled">
                Date of Birth <span style={{ color: 'red' }}>*</span>
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
                Gender <span style={{ color: 'red' }}>*</span>
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
                Beginning Date <span style={{ color: 'red' }}>*</span>
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
                Status <span style={{ color: 'red' }}>*</span>
              </EditMemberInfoItemTitle>
              <EditMemberInfoItemValue>
                <TextField
                  id="standard-input"
                  variant="standard"
                  defaultValue="#1"
                />
              </EditMemberInfoItemValue>
            </EditMemberInfoItem>
            <EditMemberInfoItem>
              <EditMemberInfoItemTitle props="disabled">
                Seniorty <span style={{ color: 'red' }}>*</span>
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
      </EditMemberContent>

      <EditMemberAction>
        <Box mr={2}>
          <ButtonCustomize
            variant="contained"
            
          >
            Update
          </ButtonCustomize>
        </Box>
        <Box>
          <ButtonCustomize variant="outlined" disabled={watchFieldsInModalCreateMember()}>Cancel</ButtonCustomize>
        </Box>
      </EditMemberAction>
    </EditMemberContainer>
  );
};
