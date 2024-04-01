import { RiDeleteBin3Line, RiEditLine } from "react-icons/ri";
import styles from "../styles/Users.module.scss";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/context";
import axios from "axios";
import { Locations } from "@/data/Location";
import { branchFormValidation } from "@/utils/formValidations";
import { createOrUpdateBranch } from "@/utils/forPost";

export const BranchCreation = () => {
  const {
    editableData,
    selectedBranch,
    setSelectedBranch,
    modalType,
    setModalType,
    breadCrumbs,
  } = useGlobalContext();

  const [error, setError] = useState(null);
  const [district, setDistrict] = useState("");

  const branchNameRef = useRef(null);
  const streetAddressRef = useRef(null);

  useEffect(() => {
    if (selectedBranch !== null) {
      setDistrict(selectedBranch?.district);
      branchNameRef.current.value = selectedBranch?.branchName;
      streetAddressRef.current.value = selectedBranch?.streetAddress;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editableData === null || editableData === undefined) {
      setError(`Select Store First`);
      return;
    }

    const proceed = branchFormValidation(
      branchNameRef.current.value,
      district,
      streetAddressRef.current.value,
      setError
    );
    if (proceed) {
      createOrUpdateBranch(
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
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error !== null && <p className={styles.serverMsg}>{error}</p>}
      <div className={styles.secBtnContainer}>
        <input
          type="text"
          placeholder="Branch name"
          ref={branchNameRef}
          className={styles.formInput}
        />
        <select
          name="district"
          id="district"
          className={`${styles.userRole} ${styles.secBtn}`}
          onChange={(e) => setDistrict(e.target.value)}
          defaultValue={selectedBranch?.district}
        >
          <option value="">District</option>
          {Locations.map((loc) => (
            <option value={loc} key={loc}>
              {loc}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Street address.."
          ref={streetAddressRef}
          className={styles.formInput}
        />
      </div>
      <button type="submit" className={styles.addOrEditBtn}>
        {modalType === "create-branch" ? <p>Create</p> : <p>Update</p>}
      </button>
    </form>
  );
};

export const BranchDetails = () => {
  const { editableData, setEditableData, setModalType, breadCrumbs } =
    useGlobalContext();

  useEffect(() => {
    if (editableData !== null && editableData.branches === undefined) {
      const canceltoken = axios.CancelToken.source();
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/stores/${editableData?.id}`, {
          withCredentials: true,
          cancelToken: canceltoken.token,
        })
        .then((res) => {
          setEditableData(res.data.data.store);
        })
        .catch((err) => {
          if (axios.isCancel(err)) console.log("cancelled");
          else console.log(err.response);
        });

      return () => {
        canceltoken.cancel();
      };
    }
  }, []);

  return (
    <>
      <div className={`${styles.actionPart} ${styles.extraPadding}`}>
        <button
          type="button"
          className={styles.addOrEditBtn}
          onClick={() => {
            setModalType("create-branch");
            breadCrumbs.push("create-branch");
          }}
        >
          <p>Add Branch</p>
        </button>
      </div>
      <ul className={`${styles.details} ${styles.branchDetails}`}>
        {editableData?.branches?.map((branch) => (
          <SingleBranch key={branch?.id} branch={branch} />
        ))}
      </ul>
    </>
  );
};

const SingleBranch = ({ branch }) => {
  const { setSelectedBranch, setModalType, breadCrumbs } = useGlobalContext();

  const handleDeleteClick = () => {
    breadCrumbs.push("delete-branch");
    setModalType("delete-branch");
    setSelectedBranch(branch);
  };

  return (
    <li>
      <div className={styles.singleLine}>
        <h6>Branch Id: </h6>
        <p>{branch?._id}</p>
      </div>
      <div className={styles.singleLine}>
        <h6>Branch Name: </h6>
        <p>{branch?.branchName}</p>
      </div>
      <div className={styles.singleLine}>
        <h6>District: </h6>
        <p>{branch?.district}</p>
      </div>
      <div className={styles.singleLine}>
        <h6>Street Address: </h6>
        <p>{branch?.streetAddress}</p>
      </div>
      <div className={`${styles.singleLine} ${styles.actionPart}`}>
        <RiEditLine
          size={24}
          className={styles.actionIcon}
          onClick={() => {
            setModalType("update-branch");
            setSelectedBranch(branch);
            breadCrumbs.push("update-branch");
          }}
        />
        <RiDeleteBin3Line
          size={24}
          className={styles.actionIcon}
          onClick={handleDeleteClick}
        />
      </div>
    </li>
  );
};
