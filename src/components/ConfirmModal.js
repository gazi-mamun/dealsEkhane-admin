import React, { useState } from "react";
import styles from "../styles/MainModal.module.scss";
import { useGlobalContext } from "@/context";
import {
  deleteBranch,
  deleteOffer,
  deletePayment,
  deleteReport,
  deleteStore,
} from "@/utils/forDelete";
import { makeReportSeen, paymentConfirmation } from "@/utils/forPost";

const ConfirmModal = ({ type }) => {
  const {
    editableData,
    setEditableData,
    selectedBranch,
    setSelectedBranch,
    setIsModalOpen,
    setModalType,
    breadCrumbs,
    setBreadCrumbs,
  } = useGlobalContext();

  const [error, setError] = useState(null);

  const handleCancelClick = () => {
    if (type === "delete-branch") {
      setSelectedBranch(null);
      setModalType("all-branches");
      breadCrumbs.pop();
    } else {
      setIsModalOpen(false);
      setEditableData(null);
      setModalType(null);
      setBreadCrumbs([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "delete-store")
      deleteStore(editableData?.id, setIsModalOpen, setError);

    if (type === "delete-branch")
      deleteBranch(
        editableData?.id,
        selectedBranch?.id,
        setIsModalOpen,
        setError
      );

    if (type === "delete-offer")
      deleteOffer(editableData?.id, setIsModalOpen, setError);

    if (type === "delete-payment")
      deletePayment(editableData?.id, setIsModalOpen, setError);

    if (type === "payment-confirmation")
      paymentConfirmation(editableData?.id, setIsModalOpen, setError);

    if (type === "delete-report")
      deleteReport(editableData?.id, setIsModalOpen, setError);

    if (type === "seen-report")
      makeReportSeen(editableData?.id, setIsModalOpen, setError);
  };

  return (
    <form className={styles.confirmForm} onSubmit={handleSubmit}>
      {error !== null && <p className={styles.serverMsg}>{error}</p>}
      {type === "seen-report" && (
        <h6>
          Are you sure you want to mark this report as seen with ID{" "}
          <span>{editableData?.id}</span>?
        </h6>
      )}
      {type === "payment-confirmation" && (
        <h6>
          Are you sure that you have received the money for payment ID{" "}
          <span>{editableData?.id}</span>?
        </h6>
      )}
      {type !== "seen-report" && type !== "payment-confirmation" && (
        <h6>
          Are you sure you want to delete the{" "}
          {type === "delete-store" && "store"}
          {type === "delete-branch" && "branch"}
          {type === "delete-offer" && "offer"}
          {type === "delete-payment" && "payment"} with the ID{" "}
          {type === "delete-branch" ? (
            <span>{selectedBranch?._id}</span>
          ) : (
            <>
              <span>{editableData?._id}</span>?
            </>
          )}
        </h6>
      )}
      <div className={styles.buttonContainer}>
        <button type="submit">
          <p>Confirm</p>
        </button>
        <button type="button" onClick={handleCancelClick}>
          <p>Cancel</p>
        </button>
      </div>
    </form>
  );
};

export default ConfirmModal;
