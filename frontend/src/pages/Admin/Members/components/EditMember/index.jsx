import React from "react";
import { TextField, ButtonCustomize, Box } from "@/shared/components";
import Breadcrumbs from "@mui/material/Breadcrumbs";

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

export const EditMember = () => {
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
          <EditMemberContentTitle>Edit Member</EditMemberContentTitle>
        </EditMemberContentHead>

        <EditMemberContentInfo>
          <EditMemberInfoRow>
            <EditMemberInfoItem>
              <EditMemberInfoItemTitle>
                EmployeeID<span>*</span>
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
              <EditMemberInfoItemTitle>
                EmployeeID<span>*</span>
              </EditMemberInfoItemTitle>
              <EditMemberInfoItemValue>
                <TextField
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
                EmployeeID<span>*</span>
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
              <EditMemberInfoItemTitle>
                EmployeeID<span>*</span>
              </EditMemberInfoItemTitle>
              <EditMemberInfoItemValue>
                <TextField
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
                EmployeeID<span>*</span>
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
              <EditMemberInfoItemTitle>
                EmployeeID<span>*</span>
              </EditMemberInfoItemTitle>
              <EditMemberInfoItemValue>
                <TextField
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
                EmployeeID<span>*</span>
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
              <EditMemberInfoItemTitle>
                EmployeeID<span>*</span>
              </EditMemberInfoItemTitle>
              <EditMemberInfoItemValue>
                <TextField
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
                EmployeeID<span>*</span>
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
              <EditMemberInfoItemTitle>
                EmployeeID<span>*</span>
              </EditMemberInfoItemTitle>
              <EditMemberInfoItemValue>
                <TextField
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
            Delete Members
          </ButtonCustomize>
        </Box>
        <Box>
          <ButtonCustomize variant="contained">Create Members</ButtonCustomize>
        </Box>
      </EditMemberAction>
    </EditMemberContainer>
  );
};
