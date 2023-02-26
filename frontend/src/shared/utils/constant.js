import moment from "moment";

export const ORDER_DIRECTION = {
  asc: "ASC",
  desc: "DESC",
};

export const isArray = (arr) => {
  return Array.isArray(arr);
};

export const MAX_HEIGHT_TABLE = 700;

export const getDataList = async (service, payload) => {
  let respData = null;
  let content = [];
  let paging = { page: 1, size: 10 };
  if (!payload) {
    respData = await service();
  } else {
    respData = await service(payload);
  }

  if (isArray(respData?.data?.content)) {
    content = respData?.data?.content;
    paging = respData?.data?.paging;
  }

  return { content, paging };
};

export const formatDate = (date) => {
  if (!date) {
    return "_";
  }

  return moment(date).format("DD-MM-YYYY");
};

export const enumRoles = {
  STAFF: "STAFF",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  ADMIN: "ADMIN"
}