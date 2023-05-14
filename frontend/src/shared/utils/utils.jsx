import moment from "moment";
import { enumMemberStatus, taskStatus, typesMessage } from "./constant";
import {
  successColor,
  errorColor,
  whiteColor,
  blackColor,
  borderColor,
  warningColor,
  hoverTextColor,
  primaryColor,
} from "./colors.utils";
import { Paper, Box, Typography } from "@/shared/components";
import DescriptionIcon from "@mui/icons-material/Description";

export const handleEmailToName = (email) => {
  const newName = email?.split("@");
  if (newName.length > 0) {
    return newName[0];
  }

  return email;
};

export const hasWhiteSpace = (s) => {
  return /^\s+$/g.test(s);
};

export function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === "[object Object]" &&
    JSON.stringify(value) === "{}"
  );
}

export function chatTimestamp(date) {
  const now = moment();
  const diff = moment.duration(now.diff(date));

  if (diff.asSeconds() < 6) {
    return <span>just now</span>;
  } else if (diff.asMinutes() < 60) {
    const minutes = Math.floor(diff.asMinutes());
    return <span>{minutes} minutes ago</span>;
  } else if (diff.asHours() < 24) {
    const hours = Math.floor(diff.asHours());
    return <span>{hours} hours ago</span>;
  } else if (diff.asDays() < 7) {
    const days = Math.floor(diff.asDays());
    return <span>{days} days ago</span>;
  } else {
    return <span>{moment(date).format("lll")}</span>;
  }
}

 export function timeCustomize(dateUTC) {
  const now = Date.now();
  const diff = now - Date.parse(dateUTC);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    const date = new Date(dateUTC);
    const dayOfMonth = date.getDate();
    const monthIndex = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dayOfMonth}/${monthIndex}/${year}`;
  }
 }

export function handleReturnInfoDirectRoom(userLogged, direct) {
  if (
    direct?.usersInfo?.length < 2 &&
    direct?.usersInfo[0]._id === userLogged?._id
  ) {
    return direct?.usersInfo[0];
  } else {
    const filterDirectRoom = direct?.usersInfo?.find(
      (userId) => userId?._id !== userLogged?._id
    );
    return filterDirectRoom;
  }
}

export function handleReturnColorStatus(userInfo) {
  switch (userInfo?.userStatus) {
    case enumMemberStatus.ONLINE: {
      return { backgroundColor: successColor };
    }
    case enumMemberStatus.BUSY: {
      return { backgroundColor: errorColor };
    }
    case enumMemberStatus.OFFLINE: {
      return {
        backgroundColor: whiteColor,
        border: `1px solid ${borderColor}`,
      };
    }
  }
}

export function hanldeReturnStatusTask(status) {
  switch (status) {
    case taskStatus.DONE: {
      return <span style={{ color: successColor }}>Done</span>;
    }
    case taskStatus.NOT_DONE: {
      return <span style={{ color: warningColor }}>Not Done</span>;
    }
  }
}

export function handleRenderMessageCustomWithType(message) {
  switch (message?.type) {
    case typesMessage.PLAIN_TEXT: {
      return renderMessageWithTypePlainText(message);
    }

    case typesMessage.IMAGE: {
      return renderMessageWithTypeImage(message);
    }

    case typesMessage.RAW: {
      return renderMessageWithTypeRaw(message);
    }

    case typesMessage.VIDEO: {
      return renderMessageWithTypeVideo(message);
    }
  }
}

const renderMessageWithTypePlainText = (message) => {
  return handleDetectUrl(message?.content);
};

const renderMessageWithTypeImage = (message) => {
  return (
    <Paper
      sx={{
        width: "100px",
        height: "100px",
        marginTop: 1,
        overflow: "hidden",
      }}
    >
      <img
        src={message?.content}
        alt="image-message"
        style={{ width: "100%", objectFit: "cover", height: "100%" }}
      />
    </Paper>
  );
};

const renderMessageWithTypeRaw = (message) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
        backgroundColor: hoverTextColor,
        width: "max-content",
        padding: "4px 8px",
        marginTop: 1,
      }}
    >
      <Box
        sx={{
          width: "34px",
          height: "34px",
          backgroundColor: primaryColor,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DescriptionIcon sx={{ color: whiteColor }} />
      </Box>
      <Typography
        ml={1}
        fontSize="small"
        sx={{ color: blackColor, fontWeight: "bold" }}
      >
        {message?.fileName} - {Math.round((message?.size / 1024) * 100) / 100}{" "}
        KB
      </Typography>
    </Box>
  );
};

const renderMessageWithTypeVideo = (message) => {
  return (
    <Paper sx={{ width: "fit-content", marginTop: 1 }}>
      <video width="100" height="100%" style={{ borderRadius: "4px" }} controls>
        <source src={message?.content} type="video/mp4" />
      </video>
    </Paper>
  );
};

const handleDetectUrl = (content) => {
  var urlRegex =
    /((http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gi;
  if (urlRegex.test(content)) {
    const newUrl = content.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
    return (
      <div
        dangerouslySetInnerHTML={{ __html: newUrl }}
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      ></div>
    );
  } else {
    return (
      <Typography fontSize="small" fontWeight="bold" noWrap>
        {content}
      </Typography>
    );
  }
};
