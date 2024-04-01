import axios from "../axios";

export const createOrUpdateBranch = async (
  branchNameRef,
  district,
  streetAddressRef,
  modalType,
  setModalType,
  editableData,
  selectedBranch,
  setSelectedBranch,
  breadCrumbs,
  setError
) => {
  try {
    const newBranch = {
      branchName: branchNameRef.current.value,
      district,
      streetAddress: streetAddressRef.current.value,
    };

    if (modalType === "create-branch") {
      const res = await axios.post(
        `/stores/${editableData?.id}/branches`,
        newBranch
      );
      const createdBranch = res.data?.data?.branch;
      editableData.branches.unshift(createdBranch);
    }
    if (modalType === "update-branch") {
      const res = await axios.patch(
        `/stores/${editableData?.id}/branches/${selectedBranch?.id}`,
        newBranch
      );
      editableData.branches.map((branch) => {
        if (branch.id === selectedBranch.id) {
          const { branchName, district, streetAddress } = res.data.data?.store;
          branch.branchName = branchName;
          branch.district = district;
          branch.streetAddress = streetAddress;
        }
      });
      setSelectedBranch(null);
    }
    setError(null);
    setModalType("all-branches");
    breadCrumbs.pop();
  } catch (error) {
    setError(error.response?.data.message);
  }
};

export const checkStoreOwner = async (storeOwnerId, setStoreOwnerRole) => {
  try {
    const res = await axios.get(`/users/${storeOwnerId}`);
    setStoreOwnerRole(res.data.data.user.role);
  } catch (error) {
    console.log(error);
  }
};

export const UpdateOfferWithFeaturedData = async (
  id,
  newForm,
  setChangedData,
  setIsModalOpen,
  setError,
  setBreadCrumbs
) => {
  try {
    const res = await axios.patch(`/offers/${id}`, newForm);
    setChangedData(res.data.data?.offer);
    setError(null);
    setIsModalOpen(false);
    setBreadCrumbs([]);
  } catch (error) {
    setError(error.response?.data.message);
  }
};

export const paymentConfirmation = async (id, setIsModalOpen, setError) => {
  try {
    await axios.patch(`/payments/${id}`);
    setError(`Payment has been made.`);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  } catch (error) {
    setError(error.message);
  }
};

export const makeReportSeen = async (id, setIsModalOpen, setError) => {
  try {
    await axios.patch(`/reports/${id}`);
    setError(`Report has maked as seen.`);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  } catch (error) {
    setError(error.message);
  }
};
