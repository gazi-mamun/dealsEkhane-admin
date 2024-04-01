import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Users.module.scss";
import { GiReceiveMoney } from "react-icons/gi";
import { RiDeleteBin3Line } from "react-icons/ri";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { specificPaymentSearch } from "@/utils/forFetch";
import { useGlobalContext } from "@/context";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paidStatus, setPaidStatus] = useState("");

  const specificSearchRef = useRef(null);

  useEffect(() => {
    const canceltoken = axios.CancelToken.source();
    let fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/payments?limit=2&page=${currentPage}`;
    if (paidStatus !== "")
      fetchUrl += `&paid=${paidStatus === "paid" ? true : false}`;
    axios
      .get(fetchUrl, {
        withCredentials: true,
        cancelToken: canceltoken.token,
      })
      .then((res) => {
        setPayments(res.data.data?.payments);
        setResultCount(res.data?.resultCount);
      })
      .catch((err) => {
        if (axios.isCancel(err)) console.log("cancelled");
        else console.log(err.response);
      });

    return () => {
      canceltoken.cancel();
    };
  }, [paidStatus, currentPage]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
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
    specificPaymentSearch(searchObj, setPayments, setResultCount);
  };

  return (
    <div className={styles.users}>
      <div className={styles.userList}>
        <h6 className="boxTitle">all payments</h6>
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
          <select
            name="paidStatus"
            id="paidStatus"
            className={styles.userRole}
            onChange={(e) => setPaidStatus(e.target.value)}
          >
            <option value="">Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Un Paid</option>
          </select>
          <form className={styles.search} onSubmit={handleSpecificSearch}>
            <input
              type="text"
              placeholder="Search payment..."
              ref={specificSearchRef}
            />
            <button type="submit">
              <p>Search</p>
            </button>
          </form>
        </div>
        <div className={styles.secBtnContainer}>
          <button type="button" className={styles.addOrEditBtn}>
            <p>Add Payment</p>
          </button>
        </div>
        <p className={styles.totalResult}>
          showing <span>{resultCount}</span> payments
        </p>
        {payments?.map((pay) => (
          <SingleUser key={pay?._id} payment={pay} />
        ))}
        {payments?.length > 0 && (
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

export default Payments;

const SingleUser = ({ payment }) => {
  const { setIsModalOpen, setModalType, setEditableData } = useGlobalContext();

  const handlePaymentClick = () => {
    setIsModalOpen(true);
    setModalType("payment-confirmation");
    setEditableData(payment);
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setModalType("delete-payment");
    setEditableData(payment);
  };

  return (
    <div className={styles.singleUser}>
      <p>{payment?._id}</p>
      <p>offer: {payment?.offer}</p>
      <p>featuredStartDate: {payment?.featuredStartDate}</p>
      <p>featuredEndDate: {payment?.featuredEndDate}</p>
      <p>{payment?.paid === true ? "paid" : "unpaid"}</p>
      {payment?.paid === false && (
        <p className={styles.actionPart}>
          <GiReceiveMoney
            size={24}
            className={styles.actionIcon}
            onClick={handlePaymentClick}
          />
          <RiDeleteBin3Line
            size={24}
            className={styles.actionIcon}
            onClick={handleDeleteClick}
          />
        </p>
      )}
    </div>
  );
};
