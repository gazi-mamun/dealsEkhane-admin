import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../styles/Users.module.scss";
import { RiStore3Fill, RiEditLine, RiDeleteBin3Line } from "react-icons/ri";
import { GiSkeletonKey } from "react-icons/gi";
import { BiSolidDetail } from "react-icons/bi";
import { TbWorldWww } from "react-icons/tb";
import { BsBodyText } from "react-icons/bs";
import CountCard from "@/components/CountCard";
import { Locations } from "@/data/Location";
import { Categories } from "@/data/Categories";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {
  getAllStores,
  regularStoreSearch,
  specificStoreSearch,
} from "@/utils/forFetch";
import { useGlobalContext } from "@/context";

const Stores = () => {
  const [storesData, setStoresData] = useState(null);
  const [stores, setStores] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [storeType, setStoreType] = useState("");
  const [status, setStatus] = useState("");
  const [district, setDistrict] = useState("");
  const [cat, setCat] = useState("");

  const searchRef = useRef(null);
  const specificSearchRef = useRef(null);

  const { setIsModalOpen, setModalType, changedData, setChangedData } =
    useGlobalContext();

  useEffect(() => {
    if (changedData !== null) {
      let foundStore = false;
      stores.map((store) => {
        if (store.id === changedData.id) {
          let newStore = JSON.stringify(changedData);
          Object.assign(store, JSON.parse(newStore));
          foundStore = true;
        }
      });
      if (!foundStore) stores.unshift(changedData);
      setChangedData(null);
    }
  }, [changedData]);

  useEffect(() => {
    const canceltoken = axios.CancelToken.source();
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/analytics/stores`, {
        withCredentials: true,
        cancelToken: canceltoken.token,
      })
      .then((res) => {
        setStoresData(res.data.data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) console.log("cancelled");
        else console.log(err.response);
      });

    return () => {
      canceltoken.cancel();
    };
  }, []);

  useEffect(() => {
    if (storesData !== null) {
      getAllStores(
        setStores,
        setResultCount,
        currentPage,
        storeType,
        status,
        district,
        cat
      );
    }
  }, [storesData, currentPage, storeType, status, district, cat]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  const handleAddButton = () => {
    setIsModalOpen(true);
    setModalType("create-store");
  };

  const handleRegularSearch = (e) => {
    e.preventDefault();
    if (
      searchRef.current?.value !== null &&
      searchRef.current?.value !== "" &&
      searchRef.current?.value !== undefined
    ) {
      regularStoreSearch(searchRef.current?.value, setStores, setResultCount);
    } else {
      getAllStores(
        setStores,
        setResultCount,
        currentPage,
        storeType,
        status,
        district,
        cat
      );
    }
  };

  const handleSpecificSearch = async (e) => {
    e.preventDefault();
    let searchObj = {};
    if (
      specificSearchRef.current?.value != null &&
      specificSearchRef.current?.value !== "" &&
      specificSearchRef.current?.value !== undefined
    ) {
      searchObj = JSON.parse(specificSearchRef.current?.value);
    }
    specificStoreSearch(searchObj, setStores, setResultCount);
  };

  return (
    <div className={styles.users}>
      <div className="countCardContainer">
        <CountCard
          title="total stores"
          count={storesData?.totalStores}
          linkText=""
          icon={<RiStore3Fill size={24} />}
        />
        <CountCard
          title="online stores"
          count={storesData?.storeCountByStoreType.map((item) => {
            if (item._id === "physical") return item.totalStores;
          })}
          linkText=""
          icon={<TbWorldWww size={24} />}
        />
        <CountCard
          title="physical stores"
          count={storesData?.storeCountByStoreType.map((item) => {
            if (item._id === "online") return item.totalStores;
          })}
          linkText=""
          icon={<BsBodyText size={24} />}
        />
        <CountCard
          title="need permission"
          count={storesData?.pendingStores}
          linkText=""
          icon={<GiSkeletonKey size={24} />}
        />
      </div>
      <div className={styles.userList}>
        <h6 className="boxTitle">all stores</h6>
        {/* button container */}
        <div className={styles.btnContainer}>
          <select
            name="storeType"
            id="storeType"
            className={styles.userRole}
            onChange={(e) => {
              setStoreType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Store Type</option>
            <option value="physical">Physical Store</option>
            <option value="online">Online Store</option>
          </select>
          <form className={styles.search} onSubmit={handleRegularSearch}>
            <input
              type="text"
              placeholder="Regular store search..."
              ref={searchRef}
            />
            <button type="submit">
              <p>Search</p>
            </button>
          </form>
        </div>
        <p className={styles.totalResult}>
          Please enter the text inside the input box as shown below to search
          for a store:
          <br />
          <br />
          <span>{`{"key": "value"}`}</span>
          <br />
          example: <span>{`{"_id": "736738183782"}`}</span>
        </p>
        <div className={styles.btnContainer}>
          <form className={styles.search} onSubmit={handleSpecificSearch}>
            <input
              type="text"
              placeholder="Specific store search..."
              ref={specificSearchRef}
            />
            <button type="submit">
              <p>Search</p>
            </button>
          </form>
        </div>
        {/* second button container */}
        <div className={styles.secBtnContainer}>
          <button
            type="button"
            className={styles.addOrEditBtn}
            onClick={handleAddButton}
          >
            <p>Add Store</p>
          </button>
          <select
            name="status"
            id="status"
            className={`${styles.userRole} ${styles.secBtn}`}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            name="district"
            id="district"
            className={`${styles.userRole} ${styles.secBtn}`}
            onChange={(e) => {
              setDistrict(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">District</option>
            {Locations.map((loc) => (
              <option value={loc} key={loc}>
                {loc}
              </option>
            ))}
          </select>
          <select
            name="category"
            id="category"
            className={`${styles.userRole} ${styles.secBtn}`}
            onChange={(e) => {
              setCat(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Category</option>
            {Categories.map((cat) => (
              <option value={cat} key={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <p className={styles.totalResult}>
          showing{" "}
          <span>
            {" "}
            {searchRef.current?.value === null ||
            searchRef.current?.value === "" ||
            searchRef.current?.value === undefined
              ? resultCount
              : stores.length}
          </span>{" "}
          stores
        </p>
        {stores?.map((store) => (
          <SingleStore key={store?._id} store={store} />
        ))}
        {stores?.length > 0 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={Math.ceil(resultCount / 2)}
            forcePage={currentPage - 1}
            previousLabel="Prev"
            renderOnZeroPageCount={null}
            containerClassName="paginationContainer"
            pageLinkClassName="pageNum"
            previousLinkClassName="prevNum"
            nextLinkClassName="nextNum"
            activeLinkClassName="pageActive"
            disabledLinkClassName="pageDisable"
          />
        )}
      </div>
    </div>
  );
};

export default Stores;

const SingleStore = ({ store }) => {
  const { setIsModalOpen, setModalType, setEditableData, breadCrumbs } =
    useGlobalContext();

  const handleEditClick = () => {
    setIsModalOpen(true);
    setModalType("update-store");
    setEditableData(store);
  };

  const handleDetailClick = () => {
    setIsModalOpen(true);
    setModalType("store-details");
    setEditableData(store);
    breadCrumbs.push("store-details");
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setModalType("delete-store");
    setEditableData(store);
  };

  return (
    <div className={styles.singleUser}>
      <p>{store?._id}</p>
      <p>{store?.storeName}</p>
      <p>{store?.status}</p>
      <p>{store?.storeType}</p>
      <p>{store?.cat}</p>
      <p className={styles.actionPart}>
        <RiEditLine
          size={24}
          className={styles.actionIcon}
          onClick={handleEditClick}
        />
        <RiDeleteBin3Line
          size={24}
          className={styles.actionIcon}
          onClick={handleDeleteClick}
        />
        <BiSolidDetail
          size={24}
          className={styles.actionIcon}
          onClick={handleDetailClick}
        />
      </p>
    </div>
  );
};
