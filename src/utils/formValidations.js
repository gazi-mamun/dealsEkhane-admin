export const storeFormValidation = (
  modalType,
  file,
  type,
  cat,
  name,
  contact,
  desc,
  websiteLink,
  setError
) => {
  if (modalType === "create-store") {
    if (!file) {
      setError("Please select your store logo");
      return false;
    }
    if (
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg"
    ) {
      if (file.size > 500000) {
        setError("The maximum logo image size is 5mb.");
        return false;
      }
    }
  }
  if (modalType === "update-store" && file) {
    if (
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg"
    ) {
      if (file.size > 500000) {
        setError("The maximum logo image size is 5mb.");
        return false;
      }
    }
  }

  if (type == null || type == undefined || type == "") {
    setError(`Please select a valid type of your store`);
    return false;
  }
  if (cat == null || cat == undefined || cat == "") {
    setError(`Please select a valid category for your store`);
    return false;
  }
  if (name.length < 4 || name.length > 26) {
    setError(`Store name must have more than 3 and less than 26 characters`);
    return false;
  }
  const contactNumberRegex = /^(?:\+?88|0088)?01[346-9]\d{8}$/;
  if (!contactNumberRegex.test(contact)) {
    setError(`Every store must provide a valid Bangladeshi contact number`);
    return false;
  }
  const websiteLinkRegex =
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
  if (type === "online" && !websiteLinkRegex.test(websiteLink)) {
    setError(`Please provide a valid website link`);
    return false;
  }
  if (desc.length < 5 || desc.length > 1500) {
    setError(
      `Store description must have more than 4 and less than 1500 characters`
    );
    return false;
  }

  setError(null);
  return true;
};

export const offerFormValidation = (
  oType,
  title,
  desc,
  code,
  sType,
  proLink,
  setError
) => {
  if (oType == null || oType == undefined || oType == "") {
    setError(`Please choose a valid type of you offer`);
    return false;
  }
  if (title.length < 5 || title.length > 250) {
    setError(`Offer title must have more than 4 and less than 251 characters`);
    return false;
  }
  if (oType === "coupon") {
    if (code.length < 4 || code.length > 20) {
      setError(
        `Please provide the coupon code which should be between 4 to 20 characters.`
      );
      return false;
    }
  }
  const proLinkRegex =
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

  if (sType === "online" && !proLinkRegex.test(proLink)) {
    setError(`Please provide a valid product link`);
    return false;
  }
  if (desc.length < 5 || desc.length > 3000) {
    setError(
      `Offer description must have more than 4 and less than 3000 characters`
    );
    return false;
  }

  setError(null);
  return true;
};

export const branchFormValidation = (name, district, address, setError) => {
  if (name.length < 4 || name.length > 30) {
    setError(`Branch name must have more than 3 and less than 31 characters`);
    return false;
  }
  if (district == null || district == undefined || district == "") {
    setError(`Please choose the district where your branch is located.`);
    return false;
  }
  if (address.length < 4 || address.length > 300) {
    setError(`Street address have more than 3 and less than 300 characters`);
    return false;
  }

  setError(null);
  return true;
};

export const featuredFormValidation = (
  file,
  fStartDate,
  fEndDate,
  setError
) => {
  if (!file) {
    setError("Please select the image for featured card");
    return false;
  }
  if (
    file.type == "image/png" ||
    file.type == "image/jpg" ||
    file.type == "image/jpeg"
  ) {
    if (file.size > 1000000) {
      setError("The maximum logo image size is 5mb.");
      return false;
    }
  }
  if (fStartDate === null || fStartDate === undefined) {
    setError(
      `Please select the start date from since you want to make your offer featured`
    );
    return false;
  }
  if (fEndDate === null || fEndDate === undefined) {
    setError(
      `Please select the end date from since you want to make your offer regular again`
    );
    return false;
  }

  setError(null);
  return true;
};

export const updateFeaturedFormValidation = (
  file,
  fStartDate,
  fEndDate,
  setError
) => {
  if (file) {
    if (
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg"
    ) {
      if (file.size > 1000000) {
        setError("The maximum logo image size is 5mb.");
        return false;
      }
    }
  }
  if (fStartDate === null || fStartDate === undefined) {
    setError(
      `Please select the start date from since you want to make your offer featured`
    );
    return false;
  }
  if (fEndDate === null || fEndDate === undefined) {
    setError(
      `Please select the end date from since you want to make your offer regular again`
    );
    return false;
  }

  setError(null);
  return true;
};
