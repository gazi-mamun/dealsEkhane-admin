import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { checkUnreadNotifications } from "./utils/forFetch";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  // FOR PROFILE PART
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [changedData, setChangedData] = useState(null);
  const [breadCrumbs, setBreadCrumbs] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    if (user) checkUnreadNotifications(setHasUnread);
  }, []);

  useEffect(() => {
    if (user !== null || undefined) {
      localStorage.setItem("user", JSON.stringify(user));
      checkUnreadNotifications(setHasUnread);
      setSocket(io("http://localhost:5000"));
      setTimeout(() => {
        localStorage.removeItem("user");
      }, 86400000);
    }
  }, [user]);

  useEffect(() => {
    if (socket !== null && user) {
      socket.emit("newUser", { userId: user?.id, userRole: user.role });
      socket.on("getNotification", (data) => {
        setNotifications((prev) => [data, ...prev]);
        setHasUnread(true);
      });
    }
  }, [socket]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        dashboardData,
        setDashboardData,
        isModalOpen,
        setIsModalOpen,
        modalType,
        setModalType,
        editableData,
        setEditableData,
        changedData,
        setChangedData,
        breadCrumbs,
        setBreadCrumbs,
        selectedBranch,
        setSelectedBranch,
        hasUnread,
        setHasUnread,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// making context global
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
