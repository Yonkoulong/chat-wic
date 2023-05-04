import moment from "moment";
import { enumMemberStatus, taskStatus } from "./constant";
import { successColor, errorColor, whiteColor, borderColor, warningColor } from './colors.utils'; 

export const handleEmailToName = (email) => {
    const newName = email?.split('@');
    if (newName.length > 0) {
        return newName[0];
    }

    return email;
}

export const hasWhiteSpace = (s) => {
    return /^\s+$/g.test(s);
};

export function isObjectEmpty(value) {
    return (
      Object.prototype.toString.call(value) === '[object Object]' &&
      JSON.stringify(value) === '{}'
    );
}

export function chatTimestamp(date) {
    const now = moment();
    const diff = moment.duration(now.diff(date));

    if(diff.asSeconds() < 6) {
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
        return <span>{moment(date).format('lll')}</span>
    }
}

export function handleReturnInfoDirectRoom (userLogged, direct) {
    
    if(direct?.usersInfo?.length < 2 && direct?.usersInfo[0]._id === userLogged?._id) {
        return direct?.usersInfo[0];
    } else {
        const filterDirectRoom = direct?.usersInfo?.find(
            (userId) => userId?._id !== userLogged?._id
        );
        return filterDirectRoom;
    }
}

export function handleReturnColorStatus (userInfo) {
    switch(userInfo?.userStatus) {
        case enumMemberStatus.ONLINE: {
            return { backgroundColor: successColor }
        }
        case enumMemberStatus.BUSY: {
            return { backgroundColor: errorColor }
        }
        case enumMemberStatus.OFFLINE: {
            return { backgroundColor: whiteColor, border: `1px solid ${borderColor}` }
        }
    }
}

export function hanldeReturnStatusTask (status) {
    switch(status) {
        case taskStatus.DONE: {
            return <span style={{ color: successColor }}>Done</span>
        }
        case taskStatus.NOT_DONE: {
            return <span style={{ color: warningColor }}>Not Done</span>
        }
    }
}