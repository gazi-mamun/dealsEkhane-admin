import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Users.module.scss";
import { RiEditLine, RiDeleteBin3Line, RiCoupon3Line } from "react-icons/ri";
import { MdLocalOffer } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { BiSolidDetail, BiSolidOffer } from "react-icons/bi";
import CountCard from "@/components/CountCard";
import { Locations } from "@/data/Location";
import { Categories } from "@/data/Categories";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {
  getAllOffers,
  regularOfferSearch,
  specificOfferSearch,
} from "@/utils/forFetch";
import { useGlobalContext } from "@/context";

const Offers = () => {
  const [offersData, setOffersData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [offerType, setOfferType] = useState("");
  const [storeType, setStoreType] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [district, setDistrict] = useState("");
  const [cat, setCat] = useState("");

  const searchRef = useRef(null);
  const specificSearchRef = useRef(null);

  const { setIsModalOpen, setModalType, changedData, setChangedData } =
    useGlobalContext();

  useEffect(() => {
    if (changedData !== null) {
      let foundOffer = false;
      offers.map((offer) => {
        if (offer.id === changedData.id) {
          let newOffer = JSON.stringify(changedData);
          Object.assign(offer, JSON.parse(newOffer));
          foundOffer = true;
        }
      });
      if (!foundOffer) offers.unshift(changedData);
      setChangedData(null);
    }
  }, [changedData]);

  useEffect(() => {
    const canceltoken = axios.CancelToken.source();
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/analytics/offers`, {
        withCredentials: true,
        cancelToken: canceltoken.token,
      })
      .then((res) => {
        setOffersData(res.data.data);
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
    if (offersData !== null) {
      getAllOffers(
        setOffers,
        setResultCount,
        currentPage,
        storeType,
        offerType,
        speciality,
        district,
        cat
      );
    }
  }, [
    offersData,
    currentPage,
    storeType,
    offerType,
    speciality,
    district,
    cat,
  ]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  const handleAddButton = () => {
    setIsModalOpen(true);
    setModalType("create-offer");
  };

  const handleRegularSearch = (e) => {
    e.preventDefault();
    if (
      searchRef.current?.value !== null &&
      searchRef.current?.value !== "" &&
      searchRef.current?.value !== undefined
    ) {
      regularOfferSearch(searchRef.current?.value, setOffers, setResultCount);
    } else {
      getAllOffers(
        setOffers,
        setResultCount,
        currentPage,
        storeType,
        offerType,
        speciality,
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
    specificOfferSearch(searchObj, setOffers, setResultCount);
  };

  return (
    <div className={styles.users}>
      <div className="countCardContainer">
        <CountCard
          title="total offers"
          count={offersData?.totalOffers}
          linkText=""
          icon={<MdLocalOffer size={24} />}
        />
        <CountCard
          title="deals"
          count={offersData?.offerCountByOfferType.map((item) => {
            if (item._id === "deal") return item.totalOffers;
          })}
          linkText=""
          icon={<BiSolidOffer size={24} />}
        />
        <CountCard
          title="coupon"
          count={offersData?.offerCountByOfferType.map((item) => {
            if (item._id === "coupon") return item.totalOffers;
          })}
          linkText=""
          icon={<RiCoupon3Line size={24} />}
        />
        <CountCard
          title="cashback"
          count={offersData?.offerCountByOfferType.map((item) => {
            if (item._id === "cashback") return item.totalOffers;
          })}
          linkText=""
          icon={<BsCash size={24} />}
        />
      </div>
      <div className={styles.userList}>
        <h6 className="boxTitle">all offers</h6>
        {/* button container */}
        <div className={styles.btnContainer}>
          <select
            name="offerType"
            id="offerType"
            className={styles.userRole}
            onChange={(e) => {
              setOfferType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">offer type</option>
            <option value="deal">deal</option>
            <option value="coupon">coupon</option>
            <option value="cashback">cashback</option>
          </select>
          <form className={styles.search} onSubmit={handleRegularSearch}>
            <input type="text" placeholder="Search offer..." ref={searchRef} />
            <button type="submit">
              <p>Search</p>
            </button>
          </form>
        </div>
        <p className={styles.totalResult}>
          Please enter the text inside the input box as shown below to search
          for a offer:
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
            <p>Add Offer</p>
          </button>
          <select
            name="speciality"
            id="speciality"
            className={`${styles.userRole} ${styles.secBtn}`}
            onChange={(e) => {
              setSpeciality(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Speciality</option>
            <option value="none">None</option>
            <option value="featured">Featured</option>
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
          <select
            name="storeType"
            id="storeType"
            className={`${styles.userRole} ${styles.secBtn}`}
            onChange={(e) => {
              setStoreType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Store Type</option>
            <option value="physical">Physical Store</option>
            <option value="online">Online Store</option>
          </select>
        </div>
        <p className={styles.totalResult}>
          showing{" "}
          <span>
            {searchRef.current?.value === null ||
            searchRef.current?.value === "" ||
            searchRef.current?.value === undefined
              ? resultCount
              : offers.length}
          </span>{" "}
          offers
        </p>
        {offers?.map((offer) => (
          <SingleOffer key={offer?._id} offer={offer} />
        ))}
        {offers?.length > 0 && (
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

export default Offers;

const SingleOffer = ({ offer }) => {
  const { setIsModalOpen, setModalType, setEditableData, breadCrumbs } =
    useGlobalContext();

  const handleEditClick = () => {
    setIsModalOpen(true);
    setModalType("update-offer");
    setEditableData(offer);
  };

  const handleDetailClick = () => {
    setIsModalOpen(true);
    setModalType("offer-details");
    setEditableData(offer);
    breadCrumbs.push("offer-details");
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setModalType("delete-offer");
    setEditableData(offer);
  };

  return (
    <div className={styles.singleUser}>
      <p>{offer?._id}</p>
      <p>{offer?.storeName}</p>
      <p>{offer?.offerType}</p>
      <p>{offer?.offerCat}</p>
      <p>{offer?.speciality === "none" ? "not-featured" : "featured"}</p>
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
