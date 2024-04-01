import { useEffect, useRef, useState } from "react";
import { CalendarInputRange } from "./CalendarInput";
import Image from "next/image";
import styles from "../styles/Users.module.scss";
import { useGlobalContext } from "@/context";
import {
  featuredFormValidation,
  updateFeaturedFormValidation,
} from "@/utils/formValidations";
import axios from "axios";
import { UpdateOfferWithFeaturedData } from "@/utils/forPost";

export const MakeFeatured = () => {
  const { editableData, modalType, setIsModalOpen, setChangedData } =
    useGlobalContext();

  const [error, setError] = useState(null);

  const [featuredImg, setFeaturedImg] = useState(null);
  const [featuredStartDate, setFeaturedStartDate] = useState(new Date());
  const [featuredEndDate, setFeaturedEndDate] = useState(new Date());
  const [maxFeaturedDate, setMaxFeaturedDate] = useState(
    new Date(editableData?.expirationDate)
  );
  const [fetchedImg, setFetchImg] = useState(null);

  const featuredStartRef = useRef(null);
  const featuredEndRef = useRef(null);

  useEffect(() => {
    if (editableData?.payment) {
      const canceltoken = axios.CancelToken.source();
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/${editableData?.payment}`,
          {
            withCredentials: true,
            cancelToken: canceltoken.token,
          }
        )
        .then((res) => {
          const createdPayment = res.data.data?.payment;
          setFetchImg(createdPayment?.featuredPic);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const proceed = featuredFormValidation(
      featuredImg,
      featuredStartRef.current,
      featuredEndRef.current,
      setError
    );
    if (proceed) {
      const newForm = new FormData();
      newForm.append("cover-image", featuredImg);
      newForm.append("featuredStartDate", featuredStartRef.current);
      newForm.append("featuredEndDate", featuredEndRef.current);
      newForm.append("speciality", "featured");

      UpdateOfferWithFeaturedData(
        editableData?.id,
        newForm,
        setChangedData,
        setIsModalOpen,
        setError
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error !== null && <p className={styles.serverMsg}>{error}</p>}
      <CalendarInputRange
        startRefName={featuredStartRef}
        endRefName={featuredEndRef}
        startDate={featuredStartDate}
        setStartDate={setFeaturedStartDate}
        endDate={featuredEndDate}
        setEndDate={setFeaturedEndDate}
        maxDate={maxFeaturedDate}
      />
      <input type="file" onChange={(e) => setFeaturedImg(e.target.files[0])} />
      {(featuredImg || editableData?.payment) && (
        <div className={styles.featuredImgContainer}>
          {(featuredImg || fetchedImg) && (
            <Image
              src={
                featuredImg
                  ? URL.createObjectURL(featuredImg)
                  : `http://127.0.0.1:5000/${fetchedImg}`
              }
              alt="Featured Image Preview"
              fill
              style={{ objectFit: "cover" }}
              sizes="100%"
            />
          )}
        </div>
      )}

      <div className={styles.secBtnContainer}>
        <button type="submit" className={styles.addOrEditBtn}>
          {modalType === "make-featured" ? <p>Confirm</p> : <p>Update Data</p>}
        </button>
      </div>
    </form>
  );
};

export const UpdateFeatured = () => {
  const {
    editableData,
    modalType,
    setIsModalOpen,
    setChangedData,
    setBreadCrumbs,
  } = useGlobalContext();

  const [error, setError] = useState(null);

  const [featuredImg, setFeaturedImg] = useState(null);
  const [featuredStartDate, setFeaturedStartDate] = useState(new Date());
  const [featuredEndDate, setFeaturedEndDate] = useState(
    new Date(editableData?.featuredEndDate)
  );
  const [maxFeaturedDate, setMaxFeaturedDate] = useState(new Date());
  const [fetchedImg, setFetchImg] = useState();

  const featuredStartRef = useRef(null);
  const featuredEndRef = useRef(null);

  useEffect(() => {
    if (editableData !== null) {
      setFeaturedStartDate(new Date(editableData?.featuredStartDate));
      setFeaturedEndDate(new Date(editableData?.featuredEndDate));
      setMaxFeaturedDate(new Date(editableData?.expirationDate));
      setFetchImg(editableData?.featuredPic);
      featuredStartRef.current = new Date(editableData?.featuredStartDate);
      featuredEndRef.current = new Date(editableData?.featuredEndDate);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const proceed = updateFeaturedFormValidation(
      featuredImg,
      featuredStartRef.current,
      featuredEndRef.current,
      setError
    );
    if (proceed) {
      const newForm = new FormData();
      if (featuredImg) {
        newForm.append("cover-image", featuredImg);
      } else {
        newForm.append("featuredPic", editableData?.featuredPic);
      }
      newForm.append("featuredStartDate", featuredStartRef.current);
      newForm.append("featuredEndDate", featuredEndRef.current);
      newForm.append("speciality", "featured");

      UpdateOfferWithFeaturedData(
        editableData?.id,
        newForm,
        setChangedData,
        setIsModalOpen,
        setError,
        setBreadCrumbs
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error !== null && <p className={styles.serverMsg}>{error}</p>}
      <CalendarInputRange
        startRefName={featuredStartRef}
        endRefName={featuredEndRef}
        startDate={featuredStartDate}
        setStartDate={setFeaturedStartDate}
        endDate={featuredEndDate}
        setEndDate={setFeaturedEndDate}
        maxDate={maxFeaturedDate}
      />
      <input type="file" onChange={(e) => setFeaturedImg(e.target.files[0])} />
      <div className={styles.featuredImgContainer}>
        {(featuredImg || fetchedImg) && (
          <Image
            src={
              featuredImg
                ? URL.createObjectURL(featuredImg)
                : `http://127.0.0.1:5000/${fetchedImg}`
            }
            alt="Featured Image Preview"
            fill
            style={{ objectFit: "cover" }}
            sizes="100%"
          />
        )}
      </div>

      <div className={styles.secBtnContainer}>
        <button type="submit" className={styles.addOrEditBtn}>
          {modalType === "make-featured" ? <p>Confirm</p> : <p>Update Data</p>}
        </button>
      </div>
      <button type="button" className={styles.addOrEditBtn}>
        Clear featured data and make speciality none
      </button>
    </form>
  );
};
