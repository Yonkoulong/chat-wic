import moment from "moment";

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
