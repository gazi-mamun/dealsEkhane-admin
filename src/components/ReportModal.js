import { useGlobalContext } from "@/context";
import { MdRemoveRedEye } from "react-icons/md";
import styles from "../styles/Users.module.scss";
import { RiDeleteBin3Line } from "react-icons/ri";

export const ReportDetails = () => {
  const { editableData, setEditableData, setModalType } = useGlobalContext();

  const handleSeenClick = () => {
    setModalType("seen-report");
  };

  const handleDeleteClick = () => {
    setModalType("delete-report");
  };

  return (
    <>
      <ul className={styles.details}>
        <li className={`${styles.actionPart} ${styles.extraPadding}`}>
          {!editableData?.seen ? (
            <MdRemoveRedEye
              size={24}
              className={styles.actionIcon}
              onClick={handleSeenClick}
            />
          ) : (
            <p>seen</p>
          )}
          <RiDeleteBin3Line
            size={22}
            className={styles.actionIcon}
            onClick={handleDeleteClick}
          />
        </li>
        <li>
          <h6>_id:</h6>
          <p>{editableData?._id}</p>
        </li>
        <li>
          <h6>reportSubject:</h6>
          <p>{editableData?.reportSubject}</p>
        </li>
        <li>
          <h6>reportDesc:</h6>
          <p>{editableData?.reportDesc}</p>
        </li>
        <li>
          <h6>reportedBy:</h6>
          <p>{editableData?.reportedBy}</p>
        </li>
        <li>
          <h6>offer:</h6>
          <p>{editableData?.offer}</p>
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
    </>
  );
};
