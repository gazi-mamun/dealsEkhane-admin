import { useGlobalContext } from "@/context";
import React, { useEffect, useState } from "react";
import styles from "../styles/Users.module.scss";
import axios from "../axios";

export const UserForm = () => {
  const { editableData, setIsModalOpen, setModalType, setChangedData } =
    useGlobalContext();
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRole === editableData?.role) {
      return setError("Befor submitting please select a new user role");
    }
    try {
      const res = await axios.patch(`/users/${editableData?._id}`, {
        role: userRole,
      });
      setError(null);
      setIsModalOpen(false);
      setModalType(null);
      setChangedData(res.data.data.user);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    setUserRole(editableData?.role);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {error !== null && <p className={styles.serverMsg}>{error}</p>}
      <div className={styles.secBtnContainer}>
        <select
          name="userRole"
          id="userRole"
          className={`${styles.userRole} ${styles.secBtn}`}
          onChange={(e) => setUserRole(e.target.value)}
          defaultValue={editableData?.role}
        >
          <option value="user">General User</option>
          <option value="store-owner">Store Owner</option>
          <option value="offer-collector">Offer Collector</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit" className={styles.addOrEditBtn}>
        Change User Role
      </button>
    </form>
  );
};
