import React, { useState, useRef, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  StyledTextField,
  StyledLabelTextField,
  ControllerInput,
  SelectMultipleInput,
  ButtonCustomize,
} from '@/shared/components';
import { DateRangeCustom } from '@/shared/components/DateRange';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { postCreateTask } from '@/services/task.services';
import { useMemberStore } from '@/stores/MemberStore';
import { useAppStore } from '@/stores/AppStore';
import { redirectTo } from '@/shared/utils/history';
import { taskStatus } from '@/shared/utils/constant';

import {
  CreateMemberFormWrapper,
  CreateMemberForm,
  CreateMemberInputContainer,
  // CreateMemberFeatureWrapper,
} from './CreateTaskModal.styles';
import { useSocketStore } from '@/stores/SocketStore';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const defaultValues = {
  title: '',
  content: '',
  assignee: '',
  startDate: '',
  endDate: '',
  creatorId: '',
  status: taskStatus.NOT_DONE,
};

export const ModalCreateTask = ({ open, onClose }) => {
  const { fetchMembers, members } = useMemberStore((state) => state);
  const client = useSocketStore((state) => state.client);
  const { userInfo } = useAppStore((state) => state);

  const [membersSelected, setMembersSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const inputFocusRef = useRef();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const watchFieldsInModalCreateMember = () => {
    let isEnable = false;
    const field = useWatch({ control });
    if (field?.title && membersSelected[0] && startDate && endDate) {
      isEnable = false;
    } else {
      isEnable = true;
    }
    return isEnable;
  };

  const onSubmit = async (data) => {
    
    try {
      const newPayloadCreateTask = {
        ...data,
        assignee: membersSelected.length > 0 ? membersSelected[0]._id : '',
        creatorId: userInfo?._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      delete newPayloadCreateTask.date;

      const respData = await postCreateTask(newPayloadCreateTask);

      if (respData) {
        setLoading(true);
        handleClose();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset({
      title: '',
      content: '',
      assignee: '',
      startDate: '',
      endDate: '',
      creatorId: '',
      status: taskStatus.NOT_DONE,
    });
    
    setStartDate(null);
    setEndDate(null);
    setMembersSelected([]);
    onClose(false);
  };

  const handleGetUsers = async () => {
    setLoading(true);
    try {
      await fetchMembers({
        organizeId: userInfo?.organizeId,
        id: '',
        email: '',
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      handleFocusInputAfterClick();
    }
  };

  const handleSelectedMember = (member) => {
    if (!member) return;

    const inputRef = inputFocusRef.current.querySelector('input');

    let newMembersSelected = [];
    newMembersSelected = [member];

    if (inputRef.value != '') {
      inputRef.value = '';
      handleGetUsers();
    }

    setMembersSelected(newMembersSelected);
  };

  const handleUnSelectedMember = (member) => {
    if (!member) return;
    const newMembersUnSelected = membersSelected?.filter(
      (memberSelected) => memberSelected?.id !== member?.id
    );
    setMembersSelected(newMembersUnSelected);
    handleFocusInputAfterClick();
  };

  const handleSearchMember = async (e) => {
    setLoading(true);
    try {
      await fetchMembers({
        organizeId: userInfo?.organizeId,
        id: '',
        email: e.target.value,
        paging: { page: 1, size: 10 },
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleFocusInputAfterClick = () => {
    const inputRef = inputFocusRef.current;
    inputRef.querySelector('input').focus();
  };

  const handleChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    
  }, [])

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Assign new task
      </BootstrapDialogTitle>
      <CreateMemberFormWrapper>
        <CreateMemberForm onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Title <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="title"
                fieldName="title"
                required={true}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter title task"
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
            <CreateMemberInputContainer>
              <StyledLabelTextField>Content</StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Content"
                fieldName="content"
                required={false}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter content"
                    multiline
                    rows={4}
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Members<span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Members"
                fieldName="assignee"
                required={false}
              >
                {(field) => (
                  <SelectMultipleInput
                    {...field}
                    inputFocusRef={inputFocusRef}
                    handleSearch={handleSearchMember}
                    onOpenDropdown={handleGetUsers}
                    handleSelectedMember={handleSelectedMember}
                    handleUnSelectedMember={handleUnSelectedMember}
                    dataList={members}
                    dataSelected={membersSelected}
                    loading={loading}
                    placeholder="Assignee"
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>

            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Due date<span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="date"
                fieldName="date"
                required={false}
              >
                {(field) => (
                  <DateRangeCustom
                    {...field}
                    handleChange={handleChangeDate}
                    startDate={startDate}
                    endDate={endDate}
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
          </DialogContent>
          <DialogActions>
            <ButtonCustomize
              variant="outlined"
              autoFocus
              handleClick={handleClose}
            >
              Cancel
            </ButtonCustomize>
            <ButtonCustomize
              variant="contained"
              type="submit"
              disabled={watchFieldsInModalCreateMember()}
            >
              Assign task
            </ButtonCustomize>
          </DialogActions>
        </CreateMemberForm>
      </CreateMemberFormWrapper>
    </BootstrapDialog>
  );
};
