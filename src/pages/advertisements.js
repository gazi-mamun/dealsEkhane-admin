import React, { useState } from "react";
import styles from "../styles/Users.module.scss";
import { RiStore3Fill, RiEditLine, RiDeleteBin3Line } from "react-icons/ri";
import { BiSolidDetail, BiArea, BiSolidArea } from "react-icons/bi";
import CountCard from "@/components/CountCard";
import { Locations } from "@/data/Location";
import { Categories } from "@/data/Categories";
import ReactPaginate from "react-paginate";

const Advertisements = () => {
  const [totalPage, setTotalPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  return (
    <div className={styles.users}>
      <div className="countCardContainer">
        <CountCard
          title="total ad spaces"
          count="7"
          linkText=""
          icon={<BiArea size={24} />}
        />
        <CountCard
          title="currently running"
          count="5"
          linkText=""
          icon={<BiSolidArea size={24} />}
        />
      </div>
      <div className={styles.userList}>
        <h6 className="boxTitle">all stores</h6>
        {/* button container */}
        <div className={styles.btnContainer}>
          <select name="storeType" id="storeType" className={styles.userRole}>
            <option value="">Store Type</option>
            <option value="physical">Physical Store</option>
            <option value="online">Online Store</option>
          </select>
          <form className={styles.search}>
            <input type="text" placeholder="Search store..." />
            <button type="submit">
              <p>Search</p>
            </button>
          </form>
        </div>
        {/* second button container */}
        <div className={styles.secBtnContainer}>
          <button type="button" className={styles.addOrEditBtn}>
            <p>Add Store</p>
          </button>
          <select
            name="status"
            id="status"
            className={`${styles.userRole} ${styles.secBtn}`}
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
          showing <span>195</span> stores
        </p>
        <SingleStore />
        <SingleStore />
        <SingleStore />
        <SingleStore />
        <SingleStore />
        <SingleStore />
        <SingleStore />
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={totalPage}
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
      </div>
    </div>
  );
};

export default Advertisements;

const SingleStore = () => {
  return (
    <div className={styles.singleUser}>
      <p>287492917483838937</p>
      <p>storename</p>
      <p>published</p>
      <p>storeType</p>
      <p>category</p>
      <p className={styles.actionPart}>
        <RiEditLine size={24} className={styles.actionIcon} />
        <RiDeleteBin3Line size={24} className={styles.actionIcon} />
        <BiSolidDetail size={24} className={styles.actionIcon} />
      </p>
    </div>
  );
};
