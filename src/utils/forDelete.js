import axios from "../axios";

export const deleteStore = async (id, setIsModalOpen, setError) => {
  try {
    await axios.delete(`/stores/${id}`);
    setError(`You've successfully removed your store.`);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  } catch (error) {
    setError(error.message);
  }
};

export const deleteBranch = async (
  storeId,
  branchId,
  setIsModalOpen,
  setError
) => {
  try {
    await axios.delete(`/stores/${storeId}/branches/${branchId}`);
    setError(`You've successfully removed your branch.`);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  } catch (e) {
    setError(e.message);
  }
};

export const deleteOffer = async (id, setIsModalOpen, setError) => {
  try {
    await axios.delete(`/offers/${id}`);
    setError(`You've successfully removed your offer.`);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  } catch (error) {
    setError(error.message);
  }
};

export const deletePayment = async (id, setIsModalOpen, setError) => {
  try {
    await axios.delete(`/payments/${id}`);
    setError(`You've successfully removed your offer.`);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  } catch (error) {
    setError(error.message);
  }
};

export const deleteReport = async (id, setIsModalOpen, setError) => {
  try {
    await axios.delete(`/reports/${id}`);
    setError(`You've successfully removed this report.`);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  } catch (error) {
    setError(error.message);
  }
};
