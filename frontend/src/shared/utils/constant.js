export const ORDER_DIRECTION = {
  asc: "ASC",
  desc: "DESC",
};

export const isArray = (arr) => {
  return Array.isArray(arr);
};

export const MAX_HEIFHT_TABLE = 700;

export const getDataList = async(service, payload) => {
  let respData = null;
  let content = [];
  let paging = { page : 1, size : 10 };
  if(!payload){
    respData = await service();
  }else{
    respData = await service(payload);
  }

  if(isArray(respData?.data?.content)){
    content = respData?.data?.content;
    paging = respData?.data?.paging;
  }

  return { content, paging };
}