import React from "react";
import styles from "../styles/MainModal.module.scss";
import { RiCloseFill } from "react-icons/ri";
import { useGlobalContext } from "@/context";
import { UserForm } from "./UserModal";
import { StoreCreateForm, StoreDetails } from "./StoreModal";
import { OfferCreation, OfferDetails } from "./OfferModal";
import { BranchCreation, BranchDetails } from "./BranchModal";
import { MakeFeatured, UpdateFeatured } from "./FeaturedModal";
import ConfirmModal from "./ConfirmModal";
import { ReportDetails } from "./ReportModal";

const MainModal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    modalType,
    setModalType,
    setEditableData,
    breadCrumbs,
    setBreadCrumbs,
    setSelectedBranch,
  } = useGlobalContext();

  const handleCloseBtnClick = () => {
    setIsModalOpen(false);
    setModalType(null);
    setEditableData(null);
    setBreadCrumbs([]);
  };

  const handleBreadCrumbsClick = (link, index) => {
    setBreadCrumbs(breadCrumbs.slice(0, index + 1));
    setModalType(link);
    setSelectedBranch(null);
  };

  return (
    <>
      {isModalOpen && (
        <div className={styles.mainModal}>
          <div className={styles.modalCenter}>
            {/* top */}
            <div className={styles.top}>
              <h6>{modalType}</h6>
              <RiCloseFill
                size={24}
                className={styles.closeIcon}
                onClick={handleCloseBtnClick}
              />
            </div>
            <div className={styles.bottom}>
              {breadCrumbs.length > 0 && (
                <ul className={styles.breadCrumbs}>
                  {breadCrumbs?.map((link, index) => (
                    <li
                      key={index}
                      onClick={() => handleBreadCrumbsClick(link, index)}
                    >
                      <p>
                        <span>&gt;</span> {link}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {modalType === "update-user" && <UserForm />}
              {modalType === "create-store" && <StoreCreateForm />}
              {modalType === "update-store" && <StoreCreateForm />}
              {modalType === "store-details" && <StoreDetails />}
              {modalType === "create-offer" && <OfferCreation />}
              {modalType === "update-offer" && <OfferCreation />}
              {modalType === "offer-details" && <OfferDetails />}
              {modalType === "all-branches" && <BranchDetails />}
              {modalType === "create-branch" && <BranchCreation />}
              {modalType === "update-branch" && <BranchCreation />}
              {modalType === "make-featured" && <MakeFeatured />}
              {modalType === "update-featured-data" && <UpdateFeatured />}
              {modalType === "report-details" && <ReportDetails />}
              {(modalType === "delete-store" ||
                modalType === "delete-branch" ||
                modalType === "delete-offer" ||
                modalType === "payment-confirmation" ||
                modalType === "delete-report" ||
                modalType === "seen-report" ||
                modalType === "delete-payment") && (
                <ConfirmModal type={modalType} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainModal;
