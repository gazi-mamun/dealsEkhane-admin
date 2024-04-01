import axios from "../axios";

export const getAllUsers = async (
  currentPage,
  setResultCount,
  setData,
  usersRole
) => {
  try {
    const fetchUrl =
      usersRole === ""
        ? `/users?limit=2&page=${currentPage}`
        : `/users?limit=2&page=${currentPage}&role=${usersRole}`;

    const response = await axios.get(fetchUrl);
    setData(response.data.data.users);
    setResultCount(response.data.data.resultCount);
  } catch (error) {
    console.log(error?.response);
  }
};

export const getAllOffers = async (
  setData,
  setResultCount,
  currentPage,
  storeType,
  offerType,
  speciality,
  district,
  cat
) => {
  try {
    let fetchUrl = `/offers?limit=2&page=${currentPage}`;
    if (storeType !== "") fetchUrl += `&storeType=${storeType}`;
    if (offerType !== "") fetchUrl += `&offerType=${offerType}`;
    if (district !== "") fetchUrl += `&districts[in]=${district}`;
    if (speciality !== "") fetchUrl += `&speciality=${speciality}`;
    if (cat !== "") fetchUrl += `&offerCat=${cat}`;

    const response = await axios.get(fetchUrl);
    setData(response.data.data.offers);
    setResultCount(response.data.resultCount);
  } catch (error) {
    console.log(error?.response);
  }
};

export const getAllStores = async (
  setData,
  setResultCount,
  currentPage,
  storeType,
  status,
  district,
  cat
) => {
  try {
    let fetchUrl = `/stores/for-admin?limit=2&page=${currentPage}`;
    if (storeType !== "") fetchUrl += `&storeType=${storeType}`;
    if (status !== "") fetchUrl += `&status=${status}`;
    if (district !== "") fetchUrl += `&districts[in]=${district}`;
    if (cat !== "") fetchUrl += `&storeCat=${cat}`;

    const response = await axios.get(fetchUrl);
    setData(response.data.data.stores);
    setResultCount(response.data.resultCount);
  } catch (error) {
    console.log(error?.response);
  }
};

export const getAllReceipts = async (currentPage, setData) => {
  try {
    const response = await axios.get(
      `/payments/receipts?limit=2&page=${currentPage}`
    );
    setData(response.data.data.receipts);
  } catch (error) {
    console.log(error?.response);
  }
};

export const searchUser = async (searchObj, setData, setResultCount) => {
  try {
    let fetchUrl = "/users?limit=2&page=1";
    if (searchObj.id) fetchUrl += `&_id=${searchObj.id}`;
    if (searchObj.username) fetchUrl += `&username=${searchObj.username}`;
    if (searchObj.email) fetchUrl += `&email=${searchObj.email}`;

    const res = await axios.get(fetchUrl);
    setData(res.data.data.users);
    if (res.data.data.resultCount) {
      setResultCount(res.data.data.resultCount);
    } else {
      setResultCount(res.data.data.users.length);
    }
  } catch (error) {
    console.log(error?.res);
  }
};

export const regularStoreSearch = async (
  searchterm,
  setData,
  setResultCount
) => {
  try {
    const res = await axios.get(
      `/search/store-search?searchterm=${searchterm}&storelimit=2`
    );
    setData(res.data.data.stores);
    setResultCount(1);
  } catch (error) {
    console.log(error?.res);
  }
};

export const specificStoreSearch = async (
  searchObj,
  setData,
  setResultCount
) => {
  try {
    let fetchUrl = `/stores/for-admin?limit=2&page=1`;
    const keys = Object.keys(searchObj);
    if (keys.length !== 0) {
      const values = Object.values(searchObj);
      fetchUrl += `&${keys[0]}=${values[0]}`;
    }
    const res = await axios.get(fetchUrl);
    setData(res.data.data.stores);
    setResultCount(res.data.resultCount);
  } catch (error) {
    console.log(error?.res);
  }
};

export const regularOfferSearch = async (
  searchterm,
  setData,
  setResultCount
) => {
  try {
    const res = await axios.get(
      `/search/offer-search?searchterm=${searchterm}`
    );
    setData(res.data.data.offers);
    setResultCount(1);
  } catch (error) {
    console.log(error?.res);
  }
};

export const specificOfferSearch = async (
  searchObj,
  setData,
  setResultCount
) => {
  try {
    let fetchUrl = `/offers?limit=2&page=1`;
    const keys = Object.keys(searchObj);
    if (keys.length !== 0) {
      const values = Object.values(searchObj);
      fetchUrl += `&${keys[0]}=${values[0]}`;
    }
    const res = await axios.get(fetchUrl);
    setData(res.data.data.offers);
    setResultCount(res.data.resultCount);
  } catch (error) {
    console.log(error?.res);
  }
};

export const specificPaymentSearch = async (
  searchObj,
  setData,
  setResultCount
) => {
  try {
    let fetchUrl = `/payments?limit=2&page=1`;
    const keys = Object.keys(searchObj);
    if (keys.length !== 0) {
      const values = Object.values(searchObj);
      fetchUrl += `&${keys[0]}=${values[0]}`;
    }
    const res = await axios.get(fetchUrl);
    setData(res.data.data.payments);
    setResultCount(res.data.resultCount);
  } catch (error) {
    console.log(error?.res);
  }
};

export const specificReceiptSearch = async (
  searchObj,
  setData,
  setResultCount
) => {
  try {
    let fetchUrl = `/payments/receipts?limit=2&page=1`;
    const keys = Object.keys(searchObj);
    if (keys.length !== 0) {
      const values = Object.values(searchObj);
      fetchUrl += `&${keys[0]}=${values[0]}`;
    }
    const res = await axios.get(fetchUrl);
    setData(res.data.data.receipts);
    setResultCount(res.data.resultCount);
  } catch (error) {
    console.log(error?.res);
  }
};

export const specificReportSearch = async (
  searchObj,
  setData,
  setResultCount
) => {
  try {
    let fetchUrl = `/reports?limit=2&page=1`;
    const keys = Object.keys(searchObj);
    if (keys.length !== 0) {
      const values = Object.values(searchObj);
      fetchUrl += `&${keys[0]}=${values[0]}`;
    }
    const res = await axios.get(fetchUrl);
    setData(res.data.data.reports);
    setResultCount(res.data.resultCount);
  } catch (error) {
    console.log(error?.res);
  }
};

export const checkUnreadNotifications = async (setHasUnread) => {
  try {
    const res = await axios.get(`/notifications/check-unread/for-admin`);
    return res.data.data?.unreadNotiCount > 0
      ? setHasUnread(true)
      : setHasUnread(false);
  } catch (e) {
    console.log(e?.response);
  }
};
