import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context";
import styles from "../styles/Users.module.scss";
import ReactPaginate from "react-paginate";
import axios from "axios";

const Profile = () => {
  const { user, notifications, setNotifications, setHasUnread } =
    useGlobalContext();

  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  useEffect(() => {
    const canceltoken = axios.CancelToken.source();
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications?limit=2&page=${currentPage}`,
        {
          withCredentials: true,
          cancelToken: canceltoken.token,
        }
      )
      .then((res) => {
        setNotifications(res.data.data?.notifications);
        setResultCount(res.data.resultCount);
        setHasUnread(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) console.log("cancelled");
        else console.log(err.response);
      });

    return () => {
      canceltoken.cancel();
    };
  }, [currentPage]);

  return (
    <>
      <div className={styles.users}>
        <div className={styles.userList}>
          <h6 className="boxTitle">Profile</h6>
          <p className={styles.totalResult}>
            Username: <span>{user?.username}</span>
            <br />
            Email: <span>{user?.email}</span>
            <br />
            Role: <span>{user?.role}</span>
            <br />
            Id: <span>{user?._id}</span>
            <br />
            CreatedAt: <span>{user?.createdAt}</span>
            <br />
            ContributionPoints: <span>{user?.contributionPoints}</span>
            <br />
          </p>
        </div>
        <div className={styles.userList}>
          <h6 className="boxTitle">Notifications</h6>
          <p className={styles.totalResult}>
            showing <span>{resultCount}</span> notifications
          </p>
          {notifications?.map((noti) => (
            <SingleNotification key={noti?._id} noti={noti} />
          ))}
          {notifications?.length > 0 && (
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
    </>
  );
};

export default Profile;

const SingleNotification = ({ noti }) => {
  return (
    <div className={styles.singleUser}>
      <p>{noti?.text}</p>
      <p>
        <span>{noti?.createdAt}</span>
      </p>
    </div>
  );
};
