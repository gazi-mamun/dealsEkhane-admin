import { useGlobalContext } from "@/context";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Users.module.scss";
import { CalendarInput, CalendarInputRange } from "./CalendarInput";
import { RiDeleteBin3Line, RiEditLine } from "react-icons/ri";
import axios from "../axios";
import { offerFormValidation } from "@/utils/formValidations";

export const OfferCreation = () => {
  const {
    editableData,
    setEditableData,
    modalType,
    setModalType,
    setChangedData,
    setIsModalOpen,
    breadCrumbs,
  } = useGlobalContext();

  const [error, setError] = useState(null);

  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState([]);
  const searchRef = useRef(null);

  const [offerType, setOfferType] = useState("");
  const [expireDate, setExpireDate] = useState(new Date());

  const titleRef = useRef(null);
  const descRef = useRef(null);
  const couponCodeRef = useRef(null);
  const expireDateRef = useRef(null);
  const productLinkRef = useRef(null);

  useEffect(() => {
    if (editableData !== null) {
      setOfferType(editableData?.offerType);
      titleRef.current.value = editableData?.title;
      descRef.current.value = editableData?.desc;
      const exDate = new Date(editableData?.expirationDate);
      expireDateRef.current = exDate;
      setExpireDate(exDate);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(productLinkRef.current?.value);
    if (modalType === "create-offer" && selectedStore === null) {
      return setError("Please select a store first");
    }
    const sType = () => {
      if (modalType === "create-offer") {
        return selectedStore?.storeType;
      }
      return editableData?.storeType;
    };
    const proceed = offerFormValidation(
      offerType,
      titleRef.current?.value,
      descRef.current?.value,
      couponCodeRef.current?.value,
      sType(),
      productLinkRef.current?.value,
      setError
    );

    if (proceed) {
      try {
        const newOffer = {
          offerType: offerType,
          title: titleRef.current.value,
          desc: descRef.current.value,
          expirationDate: expireDateRef.current,
        };
        if (offerType === "coupon")
          newOffer.code = couponCodeRef.current?.value;
        if (selectedStore?.storeType === "online")
          newOffer.productLink = productLinkRef.current?.value;

        // server work

        // creating
        if (modalType === "create-offer") {
          const res = await axios.post(
            `/offers/by-store/${selectedStore?._id}`,
            newOffer
          );
          setModalType("make-featured");
          const createdOffer = res.data?.data?.offer;
          setEditableData(createdOffer);
          setChangedData(createdOffer);
        }

        // updating
        if (modalType === "update-offer") {
          const res = await axios.patch(
            `/offers/${editableData?.id}`,
            newOffer
          );
          const createdOffer = res.data?.data?.offer;
          setChangedData(createdOffer);
          setEditableData(null);
          setIsModalOpen(false);
        }
        setError(null);
      } catch (error) {
        setError(error.response?.data.message);
      }
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `/search/store-search?searchterm=${searchRef.current?.value}&storelimit=5`
      );
      setStores(res.data.data.stores);
    } catch (error) {
      setSelectedStore(null);
      setStores(null);
      setError(error?.message);
    }
  };

  return (
    <>
      <div className={styles.btnContainer}>
        <form className={styles.search} onSubmit={handleSearchSubmit}>
          <input type="text" placeholder="Search store..." ref={searchRef} />
          <button type="submit">
            <p>Search</p>
          </button>
        </form>
      </div>
      <div className={styles.secBtnContainer}>
        {stores.map((store) => (
          <div
            className={`${styles.smStoreCard} ${
              store?.id === selectedStore?.id && styles.activeCard
            }`}
            key={store?.id}
            onClick={() => setSelectedStore(store)}
          >
            <p>{store?.storeName}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {error !== null && <p className={styles.serverMsg}>{error}</p>}
        <div className={styles.secBtnContainer}>
          <select
            name="offerType"
            id="offerType"
            className={`${styles.userRole} ${styles.secBtn}`}
            onChange={(e) => setOfferType(e.target.value)}
            defaultValue={editableData?.offerType}
          >
            <option value="">Offer Type</option>
            <option value="deal">Deal</option>
            <option value="coupon">Coupon</option>
            <option value="cashback">Cashback</option>
          </select>
          <input
            type="text"
            placeholder="Enter offer title..."
            ref={titleRef}
            className={styles.formInput}
          />
          <input
            type="text"
            placeholder="Enter coupon code..."
            ref={couponCodeRef}
            className={styles.formInput}
          />
          <input
            type="text"
            placeholder="Enter product link..."
            ref={productLinkRef}
            className={styles.formInput}
          />
        </div>
        <textarea
          type="text"
          className={`${styles.formInput} ${styles.textarea}`}
          placeholder="Enter offer description..."
          ref={descRef}
        />
        <CalendarInput
          refName={expireDateRef}
          expireDate={expireDate}
          setExpireDate={setExpireDate}
        />

        <button type="submit" className={styles.addOrEditBtn}>
          {modalType === "create-offer" ? <p>Create</p> : <p>Update</p>}
        </button>

        {modalType === "update-offer" && (
          <div className={`${styles.actionPart} ${styles.extraPadding}`}>
            {editableData?.speciality === "none" ? (
              <button
                type="button"
                className={styles.addOrEditBtn}
                onClick={() => {
                  setModalType("make-featured");
                  breadCrumbs.push("make-featured");
                }}
              >
                <p>Make Featured</p>
              </button>
            ) : (
              <button
                type="button"
                className={styles.addOrEditBtn}
                onClick={() => {
                  setModalType("update-featured-data");
                  breadCrumbs.push("update-featured-data");
                }}
              >
                <p>Update Featured Data</p>
              </button>
            )}
          </div>
        )}
      </form>
    </>
  );
};

export const OfferDetails = () => {
  const { editableData, setModalType, breadCrumbs } = useGlobalContext();

  return (
    <>
      <ul className={styles.details}>
        <li className={`${styles.actionPart} ${styles.extraPadding}`}>
          <RiEditLine
            size={24}
            className={styles.actionIcon}
            onClick={() => setModalType("update-offer")}
          />
          <RiDeleteBin3Line
            size={24}
            className={styles.actionIcon}
            onClick={() => setModalType("delete-offer")}
          />
        </li>
        <li>
          <h6>_id:</h6>
          <p>{editableData?._id}</p>
        </li>
        <li>
          <h6>offerType:</h6>
          <p>{editableData?.offerType}</p>
        </li>
        <li>
          <h6>offerCat:</h6>
          <p>{editableData?.offerCat}</p>
        </li>
        <li>
          <h6>title:</h6>
          <p>{editableData?.title}</p>
        </li>
        <li>
          <h6>desc:</h6>
          <p>{editableData?.desc}</p>
        </li>
        <li>
          <h6>offerLikes:</h6>
          <p>{editableData?.offerLikes}</p>
        </li>
        <li>
          <h6>store:</h6>
          <p>{editableData?.store}</p>
        </li>
        <li>
          <h6>storeName:</h6>
          <p>{editableData?.storeName}</p>
        </li>
        <li>
          <h6>storeType:</h6>
          <p>{editableData?.storeType}</p>
        </li>
        <li>
          <h6>districts:</h6>
          {editableData?.districts.map((dis) => (
            <p key={dis}>{dis}, &nbsp;</p>
          ))}
        </li>
        <li>
          <h6>status:</h6>
          <p>{editableData?.status}</p>
        </li>
        <li>
          <h6>expirationDate:</h6>
          <p>{editableData?.expirationDate}</p>
        </li>
        <li>
          <h6>speciality:</h6>
          <p>{editableData?.speciality}</p>
        </li>
        <li>
          <h6>featuredStartDate:</h6>
          <p>{editableData?.featuredStartDate}</p>
        </li>
        <li>
          <h6>featuredEndDate:</h6>
          <p>{editableData?.featuredEndDate}</p>
        </li>
        <li>
          <h6>featuredPic:</h6>
          <p>{editableData?.featuredPic}</p>
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
        {editableData?.speciality === "none" ? (
          <button
            type="button"
            className={styles.addOrEditBtn}
            onClick={() => {
              setModalType("make-featured");
              breadCrumbs.push("make-featured");
            }}
          >
            <p>Make Featured</p>
          </button>
        ) : (
          <button
            type="button"
            className={styles.addOrEditBtn}
            onClick={() => {
              setModalType("update-featured-data");
              breadCrumbs.push("update-featured-data");
            }}
          >
            <p>Update Featured Data</p>
          </button>
        )}
      </div>
    </>
  );
};
