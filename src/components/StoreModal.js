import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Users.module.scss";
import { useGlobalContext } from "@/context";
import { Categories } from "@/data/Categories";
import Image from "next/image";
import { RiDeleteBin3Line, RiEditLine } from "react-icons/ri";
import { storeFormValidation } from "@/utils/formValidations";
import axios from "../axios";
import { checkStoreOwner } from "@/utils/forPost";

export const StoreCreateForm = () => {
  const {
    editableData,
    setEditableData,
    modalType,
    setChangedData,
    setIsModalOpen,
  } = useGlobalContext();

  const [error, setError] = useState(null);

  const [logo, setLogo] = useState(null);
  const [storeType, setStoreType] = useState("");
  const [storeCat, setStoreCat] = useState("");
  const [storeStatus, setStoreStatus] = useState("");

  const storeNameRef = useRef(null);
  const contactNumRef = useRef(null);
  const storeDescRef = useRef(null);
  const websiteLinkRef = useRef(null);

  useEffect(() => {
    if (editableData !== null) {
      setStoreType(editableData?.storeType);
      setStoreCat(editableData?.storeCat);
      storeNameRef.current.value = editableData?.storeName;
      contactNumRef.current.value = editableData?.contactNumber;
      storeDescRef.current.value = editableData?.storeDesc;
      websiteLinkRef.current.value = editableData?.websiteLink;
    }
  }, []);

  const changeText = (text) => {
    let newText = text?.replace(/ /g, "_");
    newText = newText?.replace(/,/g, "-");
    newText = newText?.replace(/&/g, "and");
    return newText;
  };

  const handleSubmit = async (e) => {
    const changedStoreCat = changeText(storeCat);
    e.preventDefault();
    const proceed = storeFormValidation(
      modalType,
      logo,
      storeType,
      changedStoreCat,
      storeNameRef.current?.value,
      contactNumRef.current?.value,
      storeDescRef.current?.value,
      websiteLinkRef.current?.value,
      setError
    );
    if (proceed) {
      try {
        const newForm = new FormData();
        if (logo !== undefined) {
          newForm.append("logo", logo);
        }
        newForm.append("storeName", storeNameRef.current?.value);
        newForm.append("storeDesc", storeDescRef.current?.value);
        newForm.append("storeType", storeType);
        newForm.append("storeCat", changedStoreCat);
        newForm.append("contactNumber", contactNumRef.current?.value);
        if (storeType === "online") {
          newForm.append("websiteLink", websiteLinkRef.current?.value);
        }

        if (storeStatus !== "") newForm.append("status", storeStatus);

        if (modalType === "create-store") {
          const res = await axios.post(`/stores`, newForm);
          setChangedData(res.data.data?.store);
        } else {
          const res = await axios.patch(`/stores/${editableData?.id}`, newForm);
          setEditableData(null);
          setChangedData(res.data.data?.store);
        }
        setError(null);
        setIsModalOpen(false);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error !== null && <p className={styles.serverMsg}>{error}</p>}
      <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
      {logo && (
        <div className={styles.imgContainer}>
          <Image
            src={URL.createObjectURL(logo)}
            alt="Logo Preview"
            fill
            style={{ objectFit: "cover" }}
            sizes="100%"
          />
        </div>
      )}
      <div className={styles.secBtnContainer}>
        <select
          name="storeType"
          id="storeType"
          className={`${styles.userRole} ${styles.secBtn}`}
          onChange={(e) => setStoreType(e.target.value)}
          defaultValue={editableData?.storeType}
        >
          <option value="">Store Type</option>
          <option value="physical">Physical Store</option>
          <option value="online">Online Store</option>
        </select>
        <select
          name="storeCat"
          id="storeCat"
          className={`${styles.userRole} ${styles.secBtn}`}
          onChange={(e) => setStoreCat(e.target.value)}
          defaultValue={editableData?.storeCat}
        >
          <option value="">Category</option>
          {Categories.map((cat) => (
            <option value={cat} key={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Store name..."
          ref={storeNameRef}
          className={styles.formInput}
        />
        <input
          type="number"
          placeholder="Contact number..."
          ref={contactNumRef}
          className={styles.formInput}
        />
        <input
          type="text"
          placeholder="Website link..."
          ref={websiteLinkRef}
          className={styles.formInput}
        />
        <select
          name="storeStatus"
          id="storeStatus"
          className={`${styles.userRole} ${styles.secBtn}`}
          onChange={(e) => setStoreStatus(e.target.value)}
          defaultValue={editableData?.status}
        >
          <option value="">Store Status</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
      <div className={styles.secBtnContainer}>
        <textarea
          type="text"
          placeholder="Store description..."
          ref={storeDescRef}
          className={`${styles.formInput} ${styles.textarea}`}
        />
      </div>

      <button type="submit" className={styles.addOrEditBtn}>
        {modalType === "create-store" ? <p>Create</p> : <p>Update</p>}
      </button>
    </form>
  );
};

export const StoreDetails = () => {
  const { editableData, setModalType, breadCrumbs } = useGlobalContext();
  const [storeOwnerRole, setStoreOwnerRole] = useState(null);

  useEffect(() => {
    if (editableData !== null && storeOwnerRole === null) {
      checkStoreOwner(editableData?.storeOwnerId, setStoreOwnerRole);
    }
  }, []);

  return (
    <>
      <ul className={styles.details}>
        {storeOwnerRole === "store-owner" && (
          <li className={styles.ownerAlert}>
            <h6>This store was not added by the administrator</h6>
          </li>
        )}
        <li className={`${styles.actionPart} ${styles.extraPadding}`}>
          <RiEditLine
            size={24}
            className={styles.actionIcon}
            onClick={() => setModalType("update-store")}
          />
          <RiDeleteBin3Line
            size={24}
            className={styles.actionIcon}
            onClick={() => setModalType("delete-store")}
          />
        </li>
        <li>
          <h6>_id:</h6>
          <p>{editableData?._id}</p>
        </li>
        <li>
          <h6>storeName:</h6>
          <p>{editableData?.storeName}</p>
        </li>
        <li>
          <h6>contactNumber:</h6>
          <p>{editableData?.contactNumber}</p>
        </li>
        <li>
          <h6>storeDesc:</h6>
          <p>{editableData?.storeDesc}</p>
        </li>
        <li>
          <h6>storeType:</h6>
          <p>{editableData?.storeType}</p>
        </li>
        <li>
          <h6>storeCat:</h6>
          <p>{editableData?.storeCat}</p>
        </li>
        <li>
          <h6>reputationPoints:</h6>
          <p>{editableData?.reputationPoints}</p>
        </li>
        <li>
          <h6>status:</h6>
          <p>{editableData?.status}</p>
        </li>
        <li>
          <h6>districts:</h6>
          {editableData?.districts.map((dis, index) => (
            <p key={index}>{dis}, &nbsp;</p>
          ))}
        </li>
        <li>
          <h6>storeOwnerId:</h6>
          <p>{editableData?.storeOwnerId}</p>
        </li>
        <li>
          <h6>createdAt:</h6>
          <p>{editableData?.createdAt}</p>
        </li>
        <li>
          <h6>updatedAt:</h6>
          <p>{editableData?.updatedAt}</p>
        </li>
      </ul>
      <div className={`${styles.actionPart} ${styles.extraPadding}`}>
        {editableData?.storeType === "physical" && (
          <button
            type="button"
            className={styles.addOrEditBtn}
            onClick={() => {
              setModalType("all-branches");
              breadCrumbs.push("all-branches");
            }}
          >
            <p>All Branches</p>
          </button>
        )}
      </div>
    </>
  );
};
