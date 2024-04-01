import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Users.module.scss";
import CountCard from "@/components/CountCard";
import { GrTransaction } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { getAllReceipts, specificReceiptSearch } from "@/utils/forFetch";

const Receipts = () => {
  const [receiptsData, setReceiptsData] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const specificSearchRef = useRef(null);

  useEffect(() => {
    const canceltoken = axios.CancelToken.source();
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/analytics/receipts`, {
        withCredentials: true,
        cancelToken: canceltoken.token,
      })
      .then((res) => {
        setReceiptsData(res.data.data);
        setResultCount(res.data.data?.totalTransactions);
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
    if (receiptsData !== null) {
      getAllReceipts(currentPage, setReceipts);
    }
  }, [receiptsData, currentPage]);

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
    specificReceiptSearch(searchObj, setReceipts, setResultCount);
  };

  return (
    <div className={styles.users}>
      <div className="countCardContainer">
        <CountCard
          title="Total Transactions"
          count={receiptsData?.totalTransactions}
          linkText=""
          icon={<GrTransaction size={24} />}
        />
        <CountCard
          title="earning"
          count={receiptsData?.totalEarnings}
          linkText=""
          icon={<GiMoneyStack size={24} />}
        />
      </div>
      <div className={styles.userList}>
        <h6 className="boxTitle">all receipts</h6>
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
              placeholder="Search receipt..."
              ref={specificSearchRef}
            />
            <button type="submit">
              <p>Search</p>
            </button>
          </form>
        </div>
        <p className={styles.totalResult}>
          showing <span>{resultCount}</span> receipts
        </p>
        {receipts?.map((receipt) => (
          <SingleReceipt key={receipt?._id} receipt={receipt} />
        ))}
        {receipts?.length > 0 && (
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

export default Receipts;

const SingleReceipt = ({ receipt }) => {
  return (
    <div className={styles.singleUser}>
      <p>{receipt?._id}</p>
      <p>payment: {receipt?.payment}</p>
      <p>offer: {receipt?.offer}</p>
      <p>bkashId: {receipt?.bkashId}</p>
      <p>
        amount: <span>{receipt?.amount}</span>
      </p>
      <p>createdAt: {receipt?.createdAt}</p>
    </div>
  );
};
