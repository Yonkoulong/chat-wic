import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@/shared/components";
import CloseIcon from "@mui/icons-material/Close";

import {
  SearchRoomContainer,
  SearchRoomHeader,
  SearchRoomBody,
  SearchRoomBodyWrapper,
  ImageSearchStyled,
  SearchRoomStatus,
  SearchRoomName,
} from "./SearchRoom.styles";

import {
  blackColor,
  borderColor,
  whiteColor,
  hoverItemSidebarColor,
  textColorItemSidebar,
} from "@/shared/utils/colors.utils";
import { redirectTo } from '@/shared/utils/history';

import { useAppStore } from "@/stores/AppStore";
import { useMemberStore } from "@/stores/MemberStore";
import { useDebounce } from "@/shared/hooks";
import { postCheckAlreadyExistDirect } from "@/services/direct.services";

export const SearchRoom = ({ closeSearchRoom }) => {
  const { userInfo } = useAppStore((state) => state);
  const { fetchMembers, members, setLoading, loading } = useMemberStore(
    (state) => state
  );
  const [searchKey, setSearchKey] = useState();
  const debounceSearchKey = useDebounce(searchKey, 500);

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
    setLoading(true);
  };

  const handleClickRoomSearched = async (member) => {
    try {
      const payload = {
        userIds: [userInfo?._id, member?._id],
        organizeId: userInfo?.organizeId,
      };
      
      const resp = await postCheckAlreadyExistDirect(payload);
      console.log(resp?.data?.content?._id);
      if(resp) {
        redirectTo(`/chat/direct/${resp?.data?.content?._id}`);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const payload = {
          id: "",
          email: "",
          organizeId: userInfo?.organizeId,
          username: debounceSearchKey,
          paging: {},
        };

        const resp = await fetchMembers(payload);

        if (resp) {
          // setMembers(resp?.data?.content);
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.content;
        toast.error(errorMessage);
      }
    })();
  }, [debounceSearchKey]);

  return (
    <SearchRoomContainer>
      <SearchRoomHeader>
        <Box>
          <TextField
            sx={{
              ".MuiInputBase-root": {
                border: `0.1px solid ${borderColor}`,
              },
              ".MuiInputBase-input": {
                color: whiteColor,
                fontSize: "12px",
              },
            }}
            placeholder="Search member name"
            fullWidth
            name="username"
            size="small"
            value={searchKey}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                  <CloseIcon
                    fontSize="small"
                    sx={{ color: whiteColor }}
                    onClick={() => closeSearchRoom()}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </SearchRoomHeader>
      <SearchRoomBody>
        <SearchRoomBodyWrapper>
          {loading && (
            <Box my={10} textAlign="center">
              <CircularProgress color="inherit" size={30} />
            </Box>
          )}

          {!loading &&
            members?.map((member) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    columnGap: "4px",
                    "&:hover": {
                      backgroundColor: hoverItemSidebarColor,
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleClickRoomSearched(member)}
                >
                  <Box
                    sx={{ width: "32px", height: "32px", border: "1px solid" }}
                  >
                    <ImageSearchStyled src={member?.avatar} alt="img-user" />
                  </Box>
                  <SearchRoomStatus></SearchRoomStatus>
                  <SearchRoomName>{member?.username}</SearchRoomName>
                </Box>
              );
            })}
        </SearchRoomBodyWrapper>
      </SearchRoomBody>
    </SearchRoomContainer>
  );
};