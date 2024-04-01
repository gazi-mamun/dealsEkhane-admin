import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Users.module.scss";
import CountCard from "@/components/CountCard";
import { RiDeleteBin3Line } from "react-icons/ri";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { specificReportSearch } from "@/utils/forFetch";
import { BiSolidDetail } from "react-icons/bi";
import { MdRemoveRedEye } from "react-icons/md";
import { useGlobalContext } from "@/context";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const specificSearchRef = useRef(null);

  useEffect(() => {
    const canceltoken = axios.CancelToken.source();
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/reports?limit=2&page=${currentPage}`, {
        withCredentials: true,
        cancelToken: canceltoken.token,
      })
      .then((res) => {
        setReports(res.data.data.reports);
        setResultCount(res.data.resultCount);
      })
      .catch((err) => {
        if (axios.isCancel(err)) console.log("cancelled");
        else console.log(err.response);
      });

    return () => {
      canceltoken.cancel();
    };
  }, [currentPage]);

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
    specificReportSearch(searchObj, setReports, setResultCount);
  };

  return (
    <div className={styles.users}>
      <div className={styles.userList}>
        <h6 className="boxTitle">all reports</h6>
        <p className={styles.totalResult}>
          Please enter the text inside the input box as shown below to search
          for a report:
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
          showing <span>{resultCount}</span> reports
        </p>
        {reports?.map((report) => (
          <SingleReport key={report?._id} report={report} />
        ))}
        {reports?.length > 0 && (
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

export default Reports;

const SingleReport = ({ report }) => {
  const { setIsModalOpen, setModalType, setEditableData } = useGlobalContext();

  const handleSeenClick = () => {
    setIsModalOpen(true);
    setModalType("seen-report");
    setEditableData(report);
  };

  const handleDetailClick = () => {
    setIsModalOpen(true);
    setModalType("report-details");
    setEditableData(report);
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setModalType("delete-report");
    setEditableData(report);
  };

  return (
    <div className={styles.singleUser}>
      <p>{report?._id}</p>
      <p>reportedBy: {report?.reportedBy}</p>
      <p>offer: {report?.offer}</p>
      <p className={styles.actionPart}>
        {!report?.seen ? (
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
        <BiSolidDetail
          size={22}
          className={styles.actionIcon}
          onClick={handleDetailClick}
        />
      </p>
    </div>
  );
};
