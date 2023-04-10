import React from "react";

import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
} from "@/shared/components";
import {
  HomeHeaderText,
  HomeBodyList,
  HomeBodyItem,
  HomeBodyItemImageWrapper,
  HomeBodyItemTile,
  HomeBodyItemDesc,
  HomeFooterCol,
  HomeFooterItemTitle,
  HomeFooterItemText,
} from "./home.styles";
import {
  primaryColor,
  borderColor,
  inActiveColor,
} from "@/shared/utils/colors.utils";
import bannerImage from "../../assets/image/bannerImage.jpg";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

import { redirectTo } from '@/shared/utils/history';

export const HomePage = () => {



  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0",
        display: "block",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItem: "center",
          justifyContent: "space-between",
          padding: "16px 0",
        }}
      >
        <Box sx={{ display: "flex", alignItem: "center", gap: "16px" }}>
          <Typography
            sx={{ color: primaryColor, fontWeight: "bold", cursor: "default " }}
          >
            WIC
          </Typography>
          <HomeHeaderText>Product</HomeHeaderText>
          <HomeHeaderText>Solutions</HomeHeaderText>
          <HomeHeaderText>About</HomeHeaderText>
        </Box>
        <Button variant="contained" onClick={() => redirectTo('/signin')}>Sign in</Button>
      </Box>
      <Box sx={{ display: "flex", marginTop: "40px", gap: "30px" }}>
        <Box sx={{ flex: "0 0 50%" }}>
          <Typography sx={{ fontSize: "32px", fontWeight: "bold" }}>
            Talking with everyone and keep secure.
          </Typography>
          <Typography sx={{ marginTop: "16px" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
            voluptate nam nisi eos voluptatem aliquid similique provident beatae
            saepe, vitae tempore, earum a. Saepe temporibus quos molestias magni
            vitae illo.
          </Typography>
          <Button variant="contained" sx={{ marginTop: "60px" }} onClick={() => redirectTo('/signup')}>
            Create organize with your own
          </Button>
        </Box>
        <Box sx={{ flex: "0 0 50%", height: "400px" }}>
          <img
            src={bannerImage}
            alt="image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </Box>
      </Box>
      <Box sx={{ marginTop: "60px" }}>
        <HomeBodyList>
          <HomeBodyItem>
            <HomeBodyItemImageWrapper>
              <MailOutlineIcon fontSize="large" sx={{ color: "#b2a429" }} />
            </HomeBodyItemImageWrapper>
            <HomeBodyItemTile>Messaging</HomeBodyItemTile>
            <HomeBodyItemDesc>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
              optio, voluptates excepturi laboriosam dolorem voluptas illum
              commodi eius vel eligendi rerum accusamus animi neque facilis,
              eaque voluptatum fugit aliquid. Mollitia.
            </HomeBodyItemDesc>
          </HomeBodyItem>
          <HomeBodyItem>
            <HomeBodyItemImageWrapper>
              <VideoCallIcon fontSize="large" sx={{ color: "#2196f3" }} />
            </HomeBodyItemImageWrapper>
            <HomeBodyItemTile>Video Call</HomeBodyItemTile>
            <HomeBodyItemDesc>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
              optio, voluptates excepturi laboriosam dolorem voluptas illum
              commodi eius vel eligendi rerum accusamus animi neque facilis,
              eaque voluptatum fugit aliquid. Mollitia.
            </HomeBodyItemDesc>
          </HomeBodyItem>
          <HomeBodyItem>
            <HomeBodyItemImageWrapper>
              <QuestionAnswerIcon fontSize="large" sx={{ color: "#ffc107" }} />
            </HomeBodyItemImageWrapper>
            <HomeBodyItemTile>Group Chat</HomeBodyItemTile>
            <HomeBodyItemDesc>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
              optio, voluptates excepturi laboriosam dolorem voluptas illum
              commodi eius vel eligendi rerum accusamus animi neque facilis,
              eaque voluptatum fugit aliquid. Mollitia.
            </HomeBodyItemDesc>
          </HomeBodyItem>
          <HomeBodyItem>
            <HomeBodyItemImageWrapper>
              <FileCopyIcon fontSize="large" sx={{ color: "#ffc107" }} />
            </HomeBodyItemImageWrapper>
            <HomeBodyItemTile>File Sharing</HomeBodyItemTile>
            <HomeBodyItemDesc>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
              optio, voluptates excepturi laboriosam dolorem voluptas illum
              commodi eius vel eligendi rerum accusamus animi neque facilis,
              eaque voluptatum fugit aliquid. Mollitia.
            </HomeBodyItemDesc>
          </HomeBodyItem>
          <HomeBodyItem>
            <HomeBodyItemImageWrapper>
              <PrivacyTipIcon fontSize="large" sx={{ color: "#4caf50" }} />
            </HomeBodyItemImageWrapper>
            <HomeBodyItemTile>Privacy and Security</HomeBodyItemTile>
            <HomeBodyItemDesc>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
              optio, voluptates excepturi laboriosam dolorem voluptas illum
              commodi eius vel eligendi rerum accusamus animi neque facilis,
              eaque voluptatum fugit aliquid. Mollitia.
            </HomeBodyItemDesc>
          </HomeBodyItem>
        </HomeBodyList>
      </Box>
      <Box sx={{ marginTop: "60px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: "24px",
          }}
        >
          <HomeFooterCol>
            <Typography
              sx={{ fontSize: "32px", color: primaryColor, fontWeight: "bold" }}
            >
              WIC
            </Typography>
          </HomeFooterCol>
          <HomeFooterCol>
            <HomeFooterItemTitle>Why Wic?</HomeFooterItemTitle>
            <Box sx={{ marginTop: "8px" }}>
              <HomeFooterItemText href="#">WIC vs .Slack</HomeFooterItemText>
              <HomeFooterItemText href="#">Channels</HomeFooterItemText>
              <HomeFooterItemText href="#">Engagement</HomeFooterItemText>
              <HomeFooterItemText href="#">Scale</HomeFooterItemText>
              <HomeFooterItemText href="#">Watch the Demo</HomeFooterItemText>
            </Box>
          </HomeFooterCol>
          <HomeFooterCol>
            <HomeFooterItemTitle>Product</HomeFooterItemTitle>
            <Box sx={{ marginTop: "8px" }}>
              <HomeFooterItemText href="#">Features</HomeFooterItemText>
              <HomeFooterItemText href="#">Integrations</HomeFooterItemText>
              <HomeFooterItemText href="#">Enterprise</HomeFooterItemText>
              <HomeFooterItemText href="#">Solutions</HomeFooterItemText>
            </Box>
          </HomeFooterCol>
          <HomeFooterCol>
            <HomeFooterItemTitle>Solutions</HomeFooterItemTitle>
            <Box sx={{ marginTop: "8px" }}>
              <HomeFooterItemText href="#">Plans</HomeFooterItemText>
              <HomeFooterItemText href="#">Practices</HomeFooterItemText>
              <HomeFooterItemText href="#">References</HomeFooterItemText>
              <HomeFooterItemText href="#">Resources</HomeFooterItemText>
            </Box>
          </HomeFooterCol>
          <HomeFooterCol>
            <HomeFooterItemTitle>Company</HomeFooterItemTitle>
            <Box sx={{ marginTop: "8px" }}>
              <HomeFooterItemText href="#">About Us</HomeFooterItemText>
              <HomeFooterItemText href="#">Leadership</HomeFooterItemText>
              <HomeFooterItemText href="#">
                Investor Relations
              </HomeFooterItemText>
              <HomeFooterItemText href="#">News</HomeFooterItemText>
              <HomeFooterItemText href="#">Media Kit</HomeFooterItemText>
              <HomeFooterItemText href="#">Careers</HomeFooterItemText>
            </Box>
          </HomeFooterCol>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0px 24px",
          }}
        >
          <Typography sx={{ color: inActiveColor, fontSize: "12px" }}>
            ©2023 WIC Technologies, LLC, a student is studying at Greenwich
            university
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center"}}>
            <IconButton>
              <TwitterIcon sx={{ color: "#2196f3" }}></TwitterIcon>
            </IconButton>
            <IconButton>
              <FacebookIcon sx={{ color: "#1769aa" }}></FacebookIcon>
            </IconButton>
            <IconButton>
              <InstagramIcon sx={{ color: "#ff9800" }}></InstagramIcon>
            </IconButton>
            <IconButton>
              <YouTubeIcon sx={{ color: "#ff1744" }}></YouTubeIcon>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
