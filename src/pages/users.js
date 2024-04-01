import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Users.module.scss";
import CountCard from "@/components/CountCard";
import { PiUsersThreeFill } from "react-icons/pi";
import {
  RiAdminFill,
  RiStore3Fill,
  RiEditLine,
  RiUser3Fill,
} from "react-icons/ri";
import { BiSolidCollection } from "react-icons/bi";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { getAllUsers, searchUser } from "@/utils/forFetch";
import { useGlobalContext } from "@/context";

const Users = () => {
  const [usersData, setUsersData] = useState(null);
  const [users, setUsers] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersRole, setUsersRole] = useState("");
  const { changedData, setChangedData } = useGlobalContext();

  const searchRef = useRef(null);

  useEffect(() => {
    if (changedData !== null) {
      users.map((user) => {
        if (user.id === changedData.id) user.role = changedData.role;
      });
      setChangedData(null);
    }
  }, [changedData]);

  useEffect(() => {
    const canceltoken = axios.CancelToken.source();
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/analytics/users`, {
        withCredentials: true,
        cancelToken: canceltoken.token,
      })
      .then((res) => {
        setUsersData(res.data.data);
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
    if (usersData !== null) {
      getAllUsers(currentPage, setResultCount, setUsers, usersRole);
    }
  }, [usersData, currentPage, usersRole]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    let searchObj = {};
    if (
      searchRef.current?.value != null &&
      searchRef.current?.value !== "" &&
      searchRef.current?.value !== undefined
    ) {
      searchObj = JSON.parse(searchRef.current?.value);
    }
    searchUser(searchObj, setUsers, setResultCount);
  };

  return (
    <div className={styles.users}>
      <div className="countCardContainer">
        <CountCard
          title="total Users"
          count={usersData?.totalUsers}
          linkText=""
          icon={<PiUsersThreeFill size={24} />}
        />
        <CountCard
          title="general users"
          count={usersData?.usersCountByRole.map((item) => {
            if (item._id === "user") return item.totalUsers;
          })}
          linkText=""
          icon={<RiUser3Fill size={24} />}
        />
        <CountCard
          title="admins"
          count={usersData?.usersCountByRole.map((item) => {
            if (item._id === "admin") return item.totalUsers;
          })}
          linkText=""
          icon={<RiAdminFill size={24} />}
        />
        <CountCard
          title="offer collectors"
          count={usersData?.usersCountByRole.map((item) => {
            if (item._id === "offer-collector") return item.totalUsers;
          })}
          linkText=""
          icon={<BiSolidCollection size={24} />}
        />
        <CountCard
          title="store owners"
          count={usersData?.usersCountByRole.map((item) => {
            if (item._id === "store-owner") return item.totalUsers;
          })}
          linkText=""
          icon={<RiStore3Fill size={24} />}
        />
      </div>
      <div className={styles.userList}>
        <h6 className="boxTitle">all users</h6>

        <p className={styles.totalResult}>
          Please enter the text inside the input box as shown below to search
          for a user:
          <br />
          <br />
          <span>{`{"id": "write user id here"}`}</span>
          <br />
          <span>{`{"email": "write user email here"}`}</span>
          <br />
          <span>{`{"username": "write username here"}`}</span>
        </p>
        <div className={styles.btnContainer}>
          <select
            name="userRole"
            id="userRole"
            className={styles.userRole}
            onChange={(e) => {
              setUsersRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">User Role</option>
            <option value="user">General User</option>
            <option value="store-owner">Store Owner</option>
            <option value="offer-collector">Offer Collector</option>
            <option value="admin">Admin</option>
          </select>
          <form className={styles.search} onSubmit={handleSearch}>
            <input type="text" placeholder="Search user..." ref={searchRef} />
            <button type="submit">
              <p>Search</p>
            </button>
          </form>
        </div>
        <p className={styles.totalResult}>
          showing <span>{resultCount}</span> users
        </p>
        {users?.map((user) => (
          <SingleUser key={user?._id} user={user} />
        ))}
        {users?.length > 0 && (
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

export default Users;

const SingleUser = ({ user }) => {
  const { setIsModalOpen, setModalType, setEditableData } = useGlobalContext();

  const handleEditClick = () => {
    setIsModalOpen(true);
    setModalType("update-user");
    setEditableData(user);
  };

  return (
    <div className={styles.singleUser}>
      <p>{user?._id}</p>
      <p>{user?.username}</p>
      <p>{user?.email}</p>
      <p>{user?.role}</p>
      <p>
        <span>{user?.contributionPoints}</span> points
      </p>
      <p className={styles.actionPart}>
        <RiEditLine
          size={24}
          className={styles.actionIcon}
          onClick={handleEditClick}
        />
      </p>
    </div>
  );
};
