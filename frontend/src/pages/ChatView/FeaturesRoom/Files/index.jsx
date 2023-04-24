import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
} from '@/shared/components';

import { SymbolsAttachFileIcon } from '@/assets/icons';
import CloseIcon from '@mui/icons-material/Close';

import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
} from '@/shared/utils/colors.utils';
import { redirectTo } from '@/shared/utils/history';
import { typesMessage } from '@/shared/utils/constant';
import { useRoomStore } from '@/stores/RoomStore';
import { useChatStore } from '@/stores/ChatStore';

const flexCenter = {
  display: 'flex',
  alignItems: 'center',
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const Files = () => {
  const { typeRoom, roomInfo, setTypeFeatureRoom } = useRoomStore(
    (state) => state
  );

  const { messages } = useChatStore((state) => state);

  const [tabFilter, setTabFilter] = useState(0);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };

  const handleChangeTab = (event, newValue) => {
    setTabFilter(newValue);
  };

  const handleRenderValueOnTab = (tabEl) => {
    return (
      <Box sx={{ maxHeight: `calc(100vh - 220px)`, overflowY: 'auto' }}>
        {loading && (
          <Box my={10} textAlign="center">
            <CircularProgress color="inherit" size={30} />
          </Box>
        )}
        {!loading && renderElementOnTab(tabEl)}
      </Box>
    );
  };

  const renderElementOnTab = (typeMsg) => {
    switch (typeMsg) {
      case typesMessage.IMAGE: {
        const imagesFilter = messages?.filter((msg) => msg.type == typeMsg);
        return renderTabFilterImage(imagesFilter);
      }
      case typesMessage.FILE: {
        const filesFilter = messages?.filter((msg) => msg.type == typeMsg);
        return renderTabFilterFile(filesFilter);
      }
      case typesMessage.VIDEO: {
        return renderTabFilterVideo();
      }
    }
  };

  const renderTabFilterImage = (data) => {
    return data?.length > 0 ? (
      <ImageList cols={3} rowHeight={164}>
        {data?.map((item) => (
          <ImageListItem key={item?.content}>
            <img
              src={item?.content}
              srcSet={item?.content}
              alt=""
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    ) : (
      <>No data</>
    );
  };

  const renderTabFilterFile = (data) => {
    return data?.length > 0 ? (
      <Box sx={{}}>
        {data?.map((item) => {
          <Box key={item.content} sx={{ borderBottom: `1px solid red` }}>
            <IconButton></IconButton>
            <Typography></Typography>
          </Box>;
        })}
      </Box>
    ) : (
      <>No data</>
    );
  };

  const renderTabFilterVideo = () => {};

  useEffect(() => {
    setMembers(roomInfo?.membersInChannel);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          ...flexCenter,
          justifyContent: 'space-between',
          padding: 2,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Box sx={flexCenter}>
          <SymbolsAttachFileIcon />
          <Typography ml={0.5} fontWeight="bold">
            Files
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          component="label"
          sx={{
            ':hover': {
              color: primaryColor,
            },
          }}
          onClick={() => handleClickCloseMembersPopup()}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabFilter}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab label="Image" {...a11yProps(0)} />
            <Tab label="Files" {...a11yProps(1)} />
            <Tab label="Video" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabFilter} index={0}>
          {handleRenderValueOnTab(typesMessage.IMAGE)}
        </TabPanel>
        <TabPanel value={tabFilter} index={1}>
          {handleRenderValueOnTab(typesMessage.RAW)}
        </TabPanel>
        <TabPanel value={tabFilter} index={2}>
          {handleRenderValueOnTab(typesMessage.VIDEO)}
        </TabPanel>
      </Box>
    </Box>
  );
};
