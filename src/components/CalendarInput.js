import React, { forwardRef, useEffect, useState } from "react";
import styles from "../styles/CalenderInput.module.scss";
import DatePicker from "react-datepicker";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import "react-datepicker/dist/react-datepicker.css";

export const CalendarInput = ({ refName, expireDate, setExpireDate }) => {
  const minExpireDate = new Date();
  const maxExpireDate = new Date();
  maxExpireDate.setDate(maxExpireDate.getDate() + 60);

  const handleDateChange = (date) => {
    refName.current = date;
    setExpireDate(date);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const CalendarCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className={styles.calendarCustomInput} onClick={onClick} ref={ref}>
      <p>{value}</p>
    </div>
  ));

  return (
    <div className={styles.calendarInput}>
      <label htmlFor={name}>
        <p>
          expire date{" "}
          <span>(You may not extend your offer beyond three months)</span>
        </p>
      </label>
      <DatePicker
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className={styles.calendarHeader}>
            <BiChevronLeft
              size={30}
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={styles.icon}
            />

            <h6>{months[date.getMonth()]}</h6>
            <BiChevronRight
              size={30}
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={styles.icon}
            />
          </div>
        )}
        selected={expireDate}
        closeOnScroll={true}
        dateFormat="dd/MM/yyyy"
        withPortal
        customInput={<CalendarCustomInput />}
        minDate={minExpireDate}
        maxDate={maxExpireDate}
        onChange={(date) => handleDateChange(date)}
      />
    </div>
  );
};

export const CalendarInputRange = ({
  startRefName,
  endRefName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  maxDate,
  error,
  errorName,
}) => {
  const [minDate, setMinDate] = useState(new Date());
  const [newMinDate, setNewMinDate] = useState(minDate);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const CalendarCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className={styles.calendarCustomInput} onClick={onClick} ref={ref}>
      <p>{value}</p>
    </div>
  ));

  useEffect(() => {
    setEndDate(startDate);
  }, [startDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setNewMinDate(date);
    startRefName.current = date;
  };

  const handleEndDateChnage = (date) => {
    endRefName.current = date;
    setEndDate(date);
  };

  return (
    <div className={styles.calendarInput}>
      <label htmlFor={name}>
        <p>select featured date range</p>
      </label>
      <DatePicker
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className={styles.calendarHeader}>
            <BiChevronLeft
              size={30}
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={styles.icon}
            />

            <h6>{months[date.getMonth()]}</h6>
            <BiChevronRight
              size={30}
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={styles.icon}
            />
          </div>
        )}
        selected={startDate}
        closeOnScroll={true}
        dateFormat="dd/MM/yyyy"
        withPortal
        customInput={<CalendarCustomInput />}
        minDate={minDate}
        maxDate={maxDate}
        onChange={(date) => handleStartDateChange(date)}
        selectsStart
        startDate={startDate}
      />
      {errorName === "featuredStartDate" && (
        <p className={styles.inputError}>{error}</p>
      )}
      {/* end picker */}
      <DatePicker
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className={styles.calendarHeader}>
            <BiChevronLeft
              size={30}
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={styles.icon}
            />

            <h6>{months[date.getMonth()]}</h6>
            <BiChevronRight
              size={30}
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={styles.icon}
            />
          </div>
        )}
        selected={endDate}
        closeOnScroll={true}
        dateFormat="dd/MM/yyyy"
        withPortal
        customInput={<CalendarCustomInput />}
        minDate={newMinDate}
        maxDate={maxDate}
        onChange={(date) => handleEndDateChnage(date)}
        selectsEnd
        startDate={startDate}
      />
      {errorName === "featuredEndDate" && (
        <p className={styles.inputError}>{error}</p>
      )}
    </div>
  );
};
