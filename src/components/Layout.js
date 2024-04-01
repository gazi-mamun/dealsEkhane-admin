import React, { useEffect, useState } from "react";
import styles from "../styles/Layout.module.scss";
import Sidebar from "./Sidebar";
import { RiCloseFill } from "react-icons/ri";
import { CgMenuLeft } from "react-icons/cg";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [winWidth, setWinWidth] = useState();

  const handleResize = () => {
    setWinWidth(window.innerWidth);
  };
  useEffect(() => {
    setWinWidth(window.innerWidth);
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <div className={styles.layout}>
      <div
        className={styles.sidebarContainer}
        style={{
          width: winWidth < 768 ? (isSidebarOpen ? "100%" : "0px") : "280px",
        }}
      >
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      <div
        className={styles.detailsContainer}
        style={{
          width: winWidth < 768 ? (isSidebarOpen ? "0px" : "100%") : "100%",
        }}
      >
        {/* <div className={styles.haveNoti}>
          You have some new notifications. Please check them out
          <RiCloseFill size={20} className={styles.closeIcon} />
        </div> */}
        <CgMenuLeft
          size={20}
          className={styles.openBtn}
          onClick={() => setIsSidebarOpen(true)}
        />
        <div className={styles.detailsMain}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
