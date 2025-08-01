import React, { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import "../styles/signature.css";
// import Parse from "parse";
import Confetti from "react-confetti";
import axios from "axios";
import RenderAllPdfPage from "../components/pdf/RenderAllPdfPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import SignPad from "../components/pdf/SignPad";
import EmailComponent from "../components/pdf/EmailComponent";
import WidgetComponent from "../components/pdf/WidgetComponent";
import {
  contractDocument,
  embedDocId,
  multiSignEmbed,
  calculateInitialWidthHeight,
  defaultWidthHeight,
  onSaveImage,
  onSaveSign,
  contractUsers,
  contactBook,
  randomId,
  getDate,
  textWidget,
  convertPdfArrayBuffer,
  textInputWidget,
  fetchImageBase64,
  changeImageWH,
  getContainerScale,
  getDefaultSignature,
  onClickZoomIn,
  onClickZoomOut,
  rotatePdfPage,
  signatureTypes,
  getBase64FromUrl,
  handleRemoveWidgets,
  compressedFileSize,
  addWidgetSelfsignOptions,
  getBearerToken,
} from "../constant/Utils.jsx";
import { useParams } from "react-router";
import Signedby from "../components/pdf/Signedby";
import Header from "../components/pdf/PdfHeader";
import RenderPdf from "../components/pdf/RenderPdf";
import PlaceholderCopy from "../components/pdf/PlaceholderCopy";
import Title from "../components/Title";
import DropdownWidgetOption from "../components/pdf/DropdownWidgetOption";
import TextFontSetting from "../components/pdf/TextFontSetting";
import PdfZoom from "../components/pdf/PdfZoom";

import RotateAlert from "../components/RotateAlert";
import DownloadPdfZip from "../primitives/DownloadPdfZip";
import Loader from "../primitives/Loader";
import ModalUi from "../primitives/ModalUi";
import HandleError from "../primitives/HandleError";
import LoaderWithMsg from "../primitives/LoaderWithMsg";
import { API_ROUTES } from "../constant/routes";
//For signYourself inProgress section signer can add sign and complete doc sign.
function SignYourSelf() {
  
  const { docId } = useParams();
  const appName =
    "OpenSign™";
  const divRef = useRef(null);
  const nodeRef = useRef(null);
  const imageRef = useRef(null);
  const pdfRef = useRef();
  const numPages = 1;
  const [pdfDetails, setPdfDetails] = useState([]);
  const [isSignPad, setIsSignPad] = useState(false);
  const [allPages, setAllPages] = useState({
    totalPages: 0,
    currentPage: 1
  });
  const [pdfUrl, setPdfUrl] = useState();
  const [xyPosition, setXyPosition] = useState([]);
  const [defaultSignImg, setDefaultSignImg] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [image, setImage] = useState(null);
  const [isImageSelect, setIsImageSelect] = useState(false);
  const [signature, setSignature] = useState();
  const [isStamp, setIsStamp] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [signBtnPosition, setSignBtnPosition] = useState([]);
  const [xySignature, setXYSignature] = useState({});
  const [dragKey, setDragKey] = useState();
  const [fontSize, setFontSize] = useState();
  const [fontColor, setFontColor] = useState();
  const [signKey, setSignKey] = useState();
  const [imgWH, setImgWH] = useState({});
  const [pdfNewWidth, setPdfNewWidth] = useState();
  const [pdfOriginalWH, setPdfOriginalWH] = useState([]);
  const [successEmail, setSuccessEmail] = useState(false);
  const [myInitial, setMyInitial] = useState("");
  const [isInitial, setIsInitial] = useState(false);
  const [isUiLoading, setIsUiLoading] = useState(false);
  const [validateAlert, setValidateAlert] = useState(false);
  const [isLoading, setIsLoading] = useState({
    isLoad: true,
    message: ("loading-mssg")
  });
  const [handleError, setHandleError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [signTour, setSignTour] = useState(true);
  const [checkTourStatus, setCheckTourStatus] = useState(false);
  const [signerUserId, setSignerUserId] = useState();
  const [tourStatus, setTourStatus] = useState([]);
  const [contractName, setContractName] = useState("");
  const [containerWH, setContainerWH] = useState({});
  const [isPageCopy, setIsPageCopy] = useState(false);
  const [selectWidgetId, setSelectWidgetId] = useState("");
  const [otpLoader, setOtpLoader] = useState(false);
  const [showAlreadySignDoc, setShowAlreadySignDoc] = useState({
    status: false
  });
  const [isTextSetting, setIsTextSetting] = useState(false);
  const [currWidgetsDetails, setCurrWidgetsDetails] = useState({});
  const [isCheckbox, setIsCheckbox] = useState(false);
  const [widgetType, setWidgetType] = useState("");
  const [pdfLoad, setPdfLoad] = useState(false);
  const [isAlert, setIsAlert] = useState({ isShow: false, alertMessage: "" });
  const [isDontShow, setIsDontShow] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCelebration, setIsCelebration] = useState(false);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isVerifyModal, setIsVerifyModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [zoomPercent, setZoomPercent] = useState(0);
  const isHeader = true;
  const [scale, setScale] = useState(1);
  const [pdfBase64Url, setPdfBase64Url] = useState("");
  const [showRotateAlert, setShowRotateAlert] = useState({
    status: false,
    degree: 0
  });
  const [isDownloadModal, setIsDownloadModal] = useState(false);
  const [isResize, setIsResize] = useState(false);
  const [isUploadPdf, setIsUploadPdf] = useState(false);
  const [saveSignCheckbox, setSaveSignCheckbox] = useState({
    isVisible: false,
    signId: ""
  });
  const [owner, setOwner] = useState({});
  const [, drop] = useDrop({
    accept: "BOX",
    drop: (item, monitor) => addPositionOfSignature(item, monitor),
    collect: (monitor) => ({ isOver: !!monitor.isOver() })
  });
  const index = xyPosition?.findIndex((object) => {
    return object.pageNumber === pageNumber;
  });
  const rowLevel =
    localStorage.getItem("rowlevel") &&
    JSON.parse(localStorage.getItem("rowlevel"));
  const signObjId =
    rowLevel && rowLevel?.id
      ? rowLevel.id
      : rowLevel?.objectId && rowLevel.objectId;
  const documentId = docId ? docId : signObjId && signObjId;
  const senderUser =
    localStorage.getItem(`UserInformation`) && localStorage.getItem(`UserInformation`);
  const jsonSender = JSON.parse(senderUser);
  if (jsonSender) {
    jsonSender.objectId = jsonSender._id;
  }
  const [isDownloading, setIsDownloading] = useState("");

  useEffect(() => {
    if (documentId) {
      getDocumentDetails(true);
    }
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (divRef.current) {
        const pdfWidth = divRef.current.offsetWidth;
        setPdfNewWidth(pdfWidth);
        setContainerWH({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight
        });
        setScale(1);
        setZoomPercent(0);
      }
    };

    // Use setTimeout to wait for the transition to complete
    const timer = setTimeout(updateSize, 100); // match the transition duration
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divRef.current, isHeader]);

  //function for get document details for perticular signer with signer'object id
  const getDocumentDetails = async (showComplete) => {
    try {
      let isCompleted;
      //getting document details
      const documentData = await contractDocument(documentId);

      if (documentData && documentData.length > 0) {
        // Set owner details first
        const ownerDetails = documentData[0]?.ExtUserPtr || {};
        setOwner(ownerDetails);

        // Ensure all required fields are present
        const userDetails = {
          Name: ownerDetails.Name || '',
          Company: ownerDetails.Company || '',
          JobTitle: ownerDetails.JobTitle || '',
          Email: ownerDetails.Email || '',
          ...ownerDetails
        };

        // Update the document data with complete user details
        documentData[0].ExtUserPtr = userDetails;
        setPdfDetails(documentData);

        const placeholders =
          documentData[0]?.Placeholders?.length > 0
            ? documentData[0]?.Placeholders
            : [];
        setXyPosition(placeholders);
        const url =
          documentData[0] &&
          (documentData[0]?.SignedUrl || documentData[0]?.URL);
        if (url) {
          //convert document url in array buffer format to use embed widgets in pdf using pdf-lib
          const arrayBuffer = await convertPdfArrayBuffer(url);
          const base64Pdf = await getBase64FromUrl(url);
          if (arrayBuffer === "Error") {
            setHandleError(("something-went-wrong-mssg"));
          } else {
            setPdfArrayBuffer(arrayBuffer);
            setPdfBase64Url(base64Pdf);
          }
        } else {
          setHandleError(("something-went-wrong-mssg"));
        }
        isCompleted = documentData?.[0]?.IsCompleted;
        if (isCompleted) {
          setIsCelebration(true);
          setTimeout(() => setIsCelebration(false), 5000);
          setIsCompleted(true);
          setPdfUrl(documentData[0].SignedUrl);
          if (showComplete) {
            setShowAlreadySignDoc({
              status: true,
              mssg: ("document-signed-alert")
            });
          } else {
            setIsUiLoading(false);
            setIsSignPad(false);
            setIsEmail(true);
            setXyPosition([]);
            setSignBtnPosition([]);
          }
        }
      } else if (
        documentData === "Error: Something went wrong!" ||
        (documentData.result && documentData.result.error)
      ) {
        if (documentData?.result?.error?.includes("deleted")) {
          setHandleError(("document-deleted"));
        } else {
          setHandleError(("something-went-wrong-mssg"));
        }
        setIsLoading({ isLoad: false });
      } else {
        setHandleError(("no-data-avaliable"));
        setIsLoading({ isLoad: false });
      }
      //function to get default signatur eof current user from `contracts_Signature` class
      const defaultSignRes = await getDefaultSignature(jsonSender.objectId);
      if (defaultSignRes?.status === "success") {
        setSaveSignCheckbox((prev) => ({
          ...prev,
          isVisible: true,
          signId: defaultSignRes?.res?.id
        }));
        setDefaultSignImg(defaultSignRes?.res?.defaultSignature);
        setMyInitial(defaultSignRes?.res?.defaultInitial);
      }
      const contractUsersRes = await contractUsers();
      if (contractUsersRes === "Error: Something went wrong!") {
        setHandleError(("something-went-wrong-mssg"));
        setIsLoading({ isLoad: false });
      } else if (contractUsersRes[0] && contractUsersRes.length > 0) {
        setContractName("_Users");
        setSignerUserId(contractUsersRes[0].objectId);
        setSaveSignCheckbox((prev) => ({ ...prev, isVisible: true }));
        const tourstatuss =
          contractUsersRes[0].TourStatus && contractUsersRes[0].TourStatus;
        if (tourstatuss && tourstatuss.length > 0 && !isCompleted) {
          setTourStatus(tourstatuss);
          const checkTourRecipients = tourstatuss.filter(
            (data) => data.signyourself
          );
          if (checkTourRecipients && checkTourRecipients.length > 0) {
            setCheckTourStatus(checkTourRecipients[0].signyourself);
          }
        } else {
          setCheckTourStatus(true);
        }
        const loadObj = {
          isLoad: false
        };
        setIsLoading(loadObj);
      } else if (contractUsersRes.length === 0) {
        const contractContactBook = await contactBook(jsonSender.objectId);
        if (contractContactBook && contractContactBook.length > 0) {
          setContractName("_Contactbook");
          setSignerUserId(contractContactBook[0].objectId);
          const tourstatuss =
            contractContactBook[0].TourStatus &&
            contractContactBook[0].TourStatus;

          if (tourstatuss && tourstatuss.length > 0 && !isCompleted) {
            setTourStatus(tourstatuss);
            const checkTourRecipients = tourstatuss.filter(
              (data) => data.signyourself
            );
            if (checkTourRecipients && checkTourRecipients.length > 0) {
              setCheckTourStatus(checkTourRecipients[0].signyourself);
            }
          } else {
            setCheckTourStatus(true);
          }
        } else {
          setHandleError(("no-data-avaliable"));
        }
        const loadObj = {
          isLoad: false
        };
        setIsLoading(loadObj);
      }
    } catch (err) {
      console.log("Error: error in getDocumentDetails", err);
      setHandleError(("something-went-wrong-mssg"));
      setIsLoading({ isLoad: false });
    }
  };
  const getWidgetValue = (type) => {
    const userDetails = pdfDetails[0]?.ExtUserPtr || {};

    switch (type) {
      case "name":
        return userDetails.Name || '';
      case "company":
        return userDetails.Company || '';
      case "job title":
        return userDetails.JobTitle || '';
      case "email":
        return userDetails.Email || '';
      case "checkbox":
        return true;
      case "date":
        return getDate();
      default:
        return "";
    }
  };

  //function for setting position after drop signature button over pdf
  const addPositionOfSignature = (item, monitor) => {
    setCurrWidgetsDetails({});
    const key = randomId();
    let dropData = [];
    let dropObj = {};
    let filterDropPos = xyPosition?.filter(
      (data) => data.pageNumber === pageNumber
    );
    const dragTypeValue = item?.text ? item.text : monitor.type;
    const widgetValue = getWidgetValue(dragTypeValue);
    const widgetTypeExist = ["name", "company", "job title", "email"].includes(
      dragTypeValue
    );
    const containerScale = getContainerScale(
      pdfOriginalWH,
      pageNumber,
      containerWH
    );
    //adding and updating drop position in array when user drop signature button in div
    if (item === "onclick") {
      // `getBoundingClientRect()` is used to get accurate measurement height of the div
      const divHeight = divRef.current.getBoundingClientRect().height;
      const getWidth = widgetTypeExist
        ? calculateInitialWidthHeight(widgetValue).getWidth
        : defaultWidthHeight(dragTypeValue).width;
      const getHeight = defaultWidthHeight(dragTypeValue).height;

      dropObj = {
        xPosition: getWidth / 2 + containerWH.width / 2,
        yPosition: getHeight + divHeight / 2,
        isStamp:
          (dragTypeValue === "stamp" || dragTypeValue === "image") && true,
        key: key,
        type: dragTypeValue,
        scale: containerScale,
        Width: getWidth,
        Height: getHeight,
        options: addWidgetSelfsignOptions(dragTypeValue, getWidgetValue, owner)
      };
      dropData.push(dropObj);
    } else {
      //This method returns the offset of the current pointer (mouse) position relative to the client viewport.
      const offset = monitor.getClientOffset();
      const containerRect = document
        .getElementById("container")
        .getBoundingClientRect();
      //`containerRect.left`,  The distance from the left of the viewport to the left side of the element.
      //`containerRect.top` The distance from the top of the viewport to the top of the element.

      const x = offset.x - containerRect.left;
      const y = offset.y - containerRect.top;
      const getXPosition = signBtnPosition[0] ? x - signBtnPosition[0].xPos : x;
      const getYPosition = signBtnPosition[0] ? y - signBtnPosition[0].yPos : y;
      const getWidth = widgetTypeExist
        ? calculateInitialWidthHeight(widgetValue).getWidth
        : defaultWidthHeight(dragTypeValue).width;
      const getHeight = defaultWidthHeight(dragTypeValue).height;
      dropObj = {
        xPosition: getXPosition / (containerScale * scale),
        yPosition: getYPosition / (containerScale * scale),
        isStamp:
          (dragTypeValue === "stamp" || dragTypeValue === "image") && true,
        key: key,
        type: dragTypeValue,
        Width: getWidth / (containerScale * scale),
        Height: getHeight / (containerScale * scale),
        options: addWidgetSelfsignOptions(dragTypeValue, getWidgetValue, owner),
        scale: containerScale
      };
      dropData.push(dropObj);
    }
    if (filterDropPos?.length > 0) {
      const index = xyPosition?.findIndex((object) => {
        return object.pageNumber === pageNumber;
      });
      const updateData = filterDropPos?.[0].pos;
      const newSignPos = updateData.concat(dropData);
      let xyPos = { pageNumber: pageNumber, pos: newSignPos };
      xyPosition?.splice(index, 1, xyPos);
    } else {
      const xyPos = { pageNumber: pageNumber, pos: dropData };
      setXyPosition((prev) => [...prev, xyPos]);
    }

    if (
      dragTypeValue === "signature" ||
      dragTypeValue === "stamp" ||
      dragTypeValue === "image" ||
      dragTypeValue === "initials"
    ) {
      setIsSignPad(true);
    }
    if (dragTypeValue === "stamp" || dragTypeValue === "image") {
      setIsStamp(true);
    } else if (dragTypeValue === "initials") {
      setIsInitial(true);
    } else if (dragTypeValue === "checkbox") {
      setIsCheckbox(true);
    } else if (
      [
        textInputWidget,
        textWidget,
        "name",
        "company",
        "job title",
        "email"
      ].includes(dragTypeValue)
    ) {
      setFontSize(12);
      setFontColor("black");
    }
    setWidgetType(dragTypeValue);
    setSelectWidgetId(key);
    setSignKey(key);
  };

  //function for send placeholder's co-ordinate(x,y) position embed signature url or stamp url
  async function embedWidgetsData() {
    //check current user email is verified or not
    // const currentUser = JSON.parse(JSON.stringify(Parse.User.current()));
    const currentUser = {};
    let isEmailVerified;
    isEmailVerified = currentUser?.emailVerified;
    const isEnableOTP = pdfDetails?.[0]?.IsEnableOTP || false;
    if (isEnableOTP) {
      if (isEmailVerified) {
        setIsEmailVerified(isEmailVerified);
      } else {
        try {
          // const userQuery = new Parse.Query(Parse.User);
          // const user = await userQuery.get(currentUser.objectId, {
          //   sessionToken: localStorage.getItem("accesstoken")
          // });
          // if (user) {
          //   isEmailVerified = user?.get("emailVerified");
          //   setIsEmailVerified(isEmailVerified);
          // }
        } catch (e) {
          setHandleError(("something-went-wrong-mssg"));
        }
      }
    }
    if (!isEnableOTP || isEmailVerified) {
      let showAlert = false,
        isSignatureExist = false;
      try {
        for (let i = 0; i < xyPosition?.length; i++) {
          const requiredWidgets = xyPosition[i].pos.filter(
            (position) => position.type !== "checkbox"
          );
          if (requiredWidgets && requiredWidgets?.length > 0) {
            let checkSigned;
            for (let i = 0; i < requiredWidgets?.length; i++) {
              checkSigned = requiredWidgets[i]?.options?.response;
              if (!checkSigned) {
                const checkSignUrl = requiredWidgets[i]?.pos?.SignUrl;
                let checkDefaultSigned =
                  requiredWidgets[i]?.options?.defaultValue;
                if (!checkSignUrl && !checkDefaultSigned && !showAlert) {
                  showAlert = true;
                }
              }
            }
          }
          //condition to check exist signature widget or not
          if (!isSignatureExist) {
            isSignatureExist = xyPosition[i].pos.some(
              (data) => data?.type === "signature"
            );
          }
        }
        if (xyPosition.length === 0 || !isSignatureExist) {
          setIsAlert({
            header: ("fields-required"),
            isShow: true,
            alertMessage: ("signature-widget-alert-1")
          });
          return;
        } else if (showAlert) {
          setIsAlert({
            isShow: true,
            alertMessage: ("signature-widget-alert-2")
          });
          return;
        } else {
          setIsUiLoading(true);
          // Load a PDFDocument from the existing PDF bytes
          try {
            const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
            const isSignYourSelfFlow = true;
            const extUserPtr = pdfDetails[0].ExtUserPtr;
            const HeaderDocId = extUserPtr?.HeaderDocId;
            //embed document's object id to all pages in pdf document
            if (!HeaderDocId) {
              await embedDocId(pdfDoc, documentId, allPages);
            }
            //embed multi signature in pdf
            const pdfBytes = await multiSignEmbed(
              xyPosition,
              pdfDoc,
              isSignYourSelfFlow,
              scale
            );
            // console.log("pdf", pdfBytes);
            //function for call to embed signature in pdf and get digital signature pdf
            if (!pdfBytes?.error) {
              await signPdfFun(pdfBytes, documentId);
            } else {
              setIsUiLoading(false);
              setIsAlert({
                header: ("error"),
                isShow: true,
                alertMessage: ("pdf-uncompatible", { appName: appName })
              });
            }
          } catch (err) {
            setIsUiLoading(false);
            if (err && err.message.includes("is encrypted.")) {
              setIsAlert({
                header: ("error"),
                isShow: true,
                alertMessage: ("encrypted-pdf-alert")
              });
            } else {
              console.log("err in signing", err.message);
              if (err?.message?.includes("password")) {
                setIsAlert({
                  header: ("error"),
                  isShow: true,
                  alertMessage: ("encrypted-pdf-alert-1")
                });
              } else {
                setIsAlert({
                  header: ("error"),
                  isShow: true,
                  alertMessage: ("something-went-wrong-mssg")
                });
              }
            }
          }
        }
      } catch (err) {
        console.log("err in embedselfsign ", err);
        setIsUiLoading(false);
        setIsAlert({
          header: ("error"),
          isShow: true,
          alertMessage: ("something-went-wrong-mssg")
        });
      }
    }
  }
  //function for get digital signature
  const signPdfFun = async (base64Url, documentId) => {
    let getSignature;
    for (let item of xyPosition) {
      if (!getSignature) {
        const typeExist = item.pos.some((data) => data?.type);
        if (typeExist) {
          getSignature = item.pos.find((data) => data?.type === "signature");
        } else {
          getSignature = item.pos.find((data) => !data.isStamp);
        }
      }
    }
    let base64Sign = getSignature.SignUrl;
    //check https type signature (default signature exist) then convert in base64
    const isUrl = base64Sign.includes("https");
    if (isUrl) {
      try {
        base64Sign = await fetchImageBase64(base64Sign);
      } catch (e) {
        console.log("error", e);
        alert(("something-went-wrong-mssg"));
      }
    }
    //change image width and height to 300/120 in png base64
    const imagebase64 = await changeImageWH(base64Sign);
    //remove suffiix of base64 (without type)
    const suffixbase64 = imagebase64 && imagebase64.split(",").pop();
    const params = {
      pdfFile: base64Url,
      documentId: documentId,
      signature: suffixbase64,
    };
    const response = await axios.post(API_ROUTES.SAVE_PDF, params, { headers: { Authorization: getBearerToken() } });
    // const resSignPdf = await Parse.Cloud.run("signPdf", params);
    if (response) {
      const signedpdf = JSON.parse(JSON.stringify(response.data));
      setPdfUrl(signedpdf);
      getDocumentDetails(false);
    }
  };

  //function for save x and y position and show signature  tab on that position
  const handleTabDrag = (key) => {
    setDragKey(key);
    setIsDragging(true);
  };
  //function for set and update x and y postion after drag and drop signature tab
  const handleStop = (event, dragElement) => {
    setFontSize();
    setFontColor();
    if (!isResize && isDragging && dragElement) {
      event.preventDefault();
      const containerScale = getContainerScale(
        pdfOriginalWH,
        pageNumber,
        containerWH
      );
      if (dragKey >= 0) {
        const filterDropPos = xyPosition?.filter(
          (data) => data.pageNumber === pageNumber
        );
        if (filterDropPos?.length > 0) {
          const getXYdata = xyPosition[index].pos;
          const getPosData = getXYdata;
          const addSign = getPosData.map((url) => {
            if (url.key === dragKey) {
              return {
                ...url,
                xPosition: dragElement.x / (containerScale * scale),
                yPosition: dragElement.y / (containerScale * scale)
              };
            }
            return url;
          });

          const newUpdateUrl = xyPosition.map((obj, ind) => {
            if (ind === index) {
              return { ...obj, pos: addSign };
            }
            return obj;
          });
          setXyPosition(newUpdateUrl);
        }
      }
    }
    setTimeout(() => {
      setIsDragging(false);
    }, 200);
  };
  //function for get pdf page details
  const pageDetails = async (pdf) => {
    let pdfWHObj = [];
    const totalPages = pdf?.numPages;
    for (let index = 0; index < totalPages; index++) {
      const getPage = await pdf.getPage(index + 1);
      const scale = 1;
      const { width, height } = getPage.getViewport({ scale });
      pdfWHObj.push({ pageNumber: index + 1, width, height });
    }
    setPdfOriginalWH(pdfWHObj);
    setPdfLoad(true);
  };
  //function for change page numver of pdf
  function changePage(offset) {
    setSignBtnPosition([]);
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      // Ensure page number stays within valid bounds
      if (newPageNumber < 1) return 1;
      if (allPages?.totalPages && newPageNumber > allPages.totalPages) return allPages.totalPages;
      return newPageNumber;
    });
  }
  //function for image upload or update
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      compressedFileSize(file, setImgWH, setImage);
    }
  };

  //function for upload stamp or image
  const saveImage = () => {
    const getImage = onSaveImage(xyPosition, index, signKey, imgWH, image);
    setXyPosition(getImage);
  };

  //function for save button to save signature or image url
  const saveSign = (type, isDefaultSign, width, height, typedSignature) => {
    const isTypeText = width && height ? true : false;
    const signatureImg = isDefaultSign
      ? isDefaultSign === "initials"
        ? myInitial
        : defaultSignImg
      : signature;
    let imgWH = { width: width ? width : "", height: height ? height : "" };
    setIsSignPad(false);
    setIsImageSelect(false);
    setImage();
    if (isDefaultSign) {
      const img = new Image();
      img.src = defaultSignImg;
      if (img.complete) {
        imgWH = { width: img.width, height: img.height };
      }
    }
    const getUpdatePosition = onSaveSign(
      type,
      xyPosition,
      index,
      signKey,
      signatureImg,
      imgWH,
      isDefaultSign,
      isTypeText,
      typedSignature
    );

    setXyPosition(getUpdatePosition);
  };
  //function for capture position on hover or touch widgets button
  const handleDivClick = (e) => {
    console.log('EDHAR HU MAI')
    const isTouchEvent = e.type.startsWith("touch");
    const divRect = e.currentTarget.getBoundingClientRect();
    let mouseX, mouseY;
    if (isTouchEvent) {
      const touch = e.touches[0]; // Get the first touch point
      mouseX = touch.clientX - divRect.left;
      mouseY = touch.clientY - divRect.top;
      setSignBtnPosition([{ xPos: mouseX, yPos: mouseY }]);
    } else {
      mouseX = e.clientX - divRect.left;
      mouseY = e.clientY - divRect.top;
      const xyPosition = { xPos: mouseX, yPos: mouseY };
      setXYSignature(xyPosition);
    }
  };

  //function for capture position of x and y on hover signature button last position
  const handleMouseLeave = () => {
    setSignBtnPosition([xySignature]);
  };
  //function for delete signature block
  const handleDeleteSign = (key) => {
    setCurrWidgetsDetails({});
    const updateResizeData = [];
    let filterData = xyPosition[index].pos.filter((data) => data.key !== key);
    //delete and update block position
    if (filterData.length > 0) {
      updateResizeData.push(filterData);
      const newUpdatePos = xyPosition.map((obj, ind) => {
        if (ind === index) {
          return { ...obj, pos: updateResizeData[0] };
        }
        return obj;
      });

      setXyPosition(newUpdatePos);
    } else {
      const getRemainPage = xyPosition.filter(
        (data) => data.pageNumber !== pageNumber
      );

      if (getRemainPage && getRemainPage.length > 0) {
        setXyPosition(getRemainPage);
      } else {
        setXyPosition([]);
      }
    }
  };

  const handleSaveWidgetsOptions = (
    dropdownName,
    dropdownOptions,
    minCount,
    maxCount,
    isReadOnly,
    addOption,
    deleteOption,
    status,
    defaultValue,
    isHideLabel
  ) => {
    const getPageNumer = xyPosition.filter(
      (data) => data.pageNumber === pageNumber
    );
    if (getPageNumer.length > 0) {
      const getXYdata = getPageNumer[0].pos;
      const getPosData = getXYdata;
      const addSignPos = getPosData.map((position) => {
        if (position.key === signKey) {
          if (addOption) {
            return {
              ...position,
              Height: position.Height
                ? position.Height + 15
                : defaultWidthHeight(widgetType).height + 15
            };
          } else if (deleteOption) {
            return {
              ...position,
              Height: position.Height
                ? position.Height - 15
                : defaultWidthHeight(widgetType).height - 15
            };
          } else {
            return {
              ...position,
              options: {
                ...position.options,
                name: dropdownName,
                values: dropdownOptions,
                isReadOnly: isReadOnly,
                isHideLabel: isHideLabel || false,
                fontSize:
                  fontSize || currWidgetsDetails?.options?.fontSize || 12,
                fontColor:
                  fontColor || currWidgetsDetails?.options?.fontColor || "black"
              }
            };
          }
        }
        return position;
      });
      const updateXYposition = xyPosition.map((obj, ind) => {
        if (ind === index) {
          return { ...obj, pos: addSignPos };
        }
        return obj;
      });
      setXyPosition(updateXYposition);
      if (!addOption && !deleteOption) {
        handleCloseModal();
      }
    }
    setFontSize();
    setFontColor();
  };
  const handleCloseModal = () => {
    setCurrWidgetsDetails({});
    setIsCheckbox(false);
  };
  const handleTextSettingModal = (value) => {
    setIsTextSetting(value);
  };
  const handleSaveFontSize = () => {
    const getPageNumer = xyPosition.filter(
      (data) => data.pageNumber === pageNumber
    );
    if (getPageNumer.length > 0) {
      const getXYdata = getPageNumer[0].pos;
      const getPosData = getXYdata;
      const addSignPos = getPosData.map((position) => {
        if (position.key === signKey) {
          return {
            ...position,
            options: {
              ...position.options,
              fontSize: fontSize || currWidgetsDetails?.options?.fontSize || 12,
              fontColor:
                fontColor || currWidgetsDetails?.options?.fontColor || "black"
            }
          };
        }
        return position;
      });
      const updateXYposition = xyPosition.map((obj, ind) => {
        if (ind === index) {
          return { ...obj, pos: addSignPos };
        }
        return obj;
      });
      setXyPosition(updateXYposition);
      setFontSize();
      setFontColor();
      handleTextSettingModal(false);
    }
  };
  const clickOnZoomIn = () => {
    onClickZoomIn(scale, zoomPercent, setScale, setZoomPercent);
  };
  const clickOnZoomOut = () => {
    onClickZoomOut(zoomPercent, scale, setZoomPercent, setScale);
  };
  //`handleRotationFun` function is used to roatate pdf particular page
  const handleRotationFun = async (rotateDegree) => {
    const isPlaceholder = handleRotateWarning();
    if (isPlaceholder) {
      setShowRotateAlert({ status: true, degree: rotateDegree });
    } else {
      setIsUploadPdf(true);
      const urlDetails = await rotatePdfPage(
        rotateDegree,
        pageNumber - 1,
        pdfArrayBuffer
      );
      setPdfArrayBuffer(urlDetails.arrayBuffer);
      setPdfBase64Url(urlDetails.base64);
    }
  };

  //function to show warning when user rotate page and there are some already widgets on that page
  const handleRotateWarning = () => {
    const placeholderData = xyPosition?.filter(
      (data) => data.pageNumber === pageNumber
    );
    if (placeholderData && placeholderData.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  //function to use remove widgets from current page when user want to rotate page
  const handleRemovePlaceholder = async () => {
    handleRemoveWidgets(
      setXyPosition,
      xyPosition,
      pageNumber,
      setShowRotateAlert
    );
    const urlDetails = await rotatePdfPage(
      showRotateAlert.degree,
      pageNumber - 1,
      pdfArrayBuffer
    );
    setPdfArrayBuffer(urlDetails.arrayBuffer);
    setPdfBase64Url(urlDetails.base64);
    setShowRotateAlert({ status: false, degree: 0 });
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Title title={"Signyourself"} />
      {isLoading.isLoad ? (
        <LoaderWithMsg isLoading={isLoading} />
      ) : handleError ? (
        <HandleError handleError={handleError} />
      ) : (
        <div>
          {isUiLoading && (
            <div className="absolute h-[100vh] w-full z-[999] flex flex-col justify-center items-center bg-[#e6f2f2] bg-opacity-80">
              <Loader />
              <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                {("loader")}
              </span>
            </div>
          )}
          {isDownloading === "pdf" && (
            <div className="fixed z-[200] inset-0 flex justify-center items-center bg-black bg-opacity-30">
              <Loader />
            </div>
          )}
          {isCelebration && (
            <div className="relative z-[1000]">
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                gravity={0.1}
              />
            </div>
          )}
          <div className="relative op-card overflow-hidden flex flex-col md:flex-row justify-between bg-base-300">
            {/* this component used for UI interaction and show their functionality */}

            {/* this component used to render all pdf pages in left side */}

            <RenderAllPdfPage
              allPages={allPages}
              setAllPages={setAllPages}
              setPageNumber={setPageNumber}
              setSignBtnPosition={setSignBtnPosition}
              pageNumber={pageNumber}
              containerWH={containerWH}
              pdfBase64Url={pdfBase64Url}
              signedUrl={pdfDetails?.[0]?.SignedUrl || ""}
              setPdfArrayBuffer={setPdfArrayBuffer}
              setPdfBase64Url={setPdfBase64Url}
              setIsUploadPdf={setIsUploadPdf}
              pdfArrayBuffer={pdfArrayBuffer}
              isMergePdfBtn={!pdfDetails?.[0]?.IsCompleted}
            />
            <div className=" w-full md:w-[57%] flex mr-4">
              <PdfZoom
                clickOnZoomIn={clickOnZoomIn}
                clickOnZoomOut={clickOnZoomOut}
                handleRotationFun={handleRotationFun}
                pdfArrayBuffer={pdfArrayBuffer}
                pageNumber={pageNumber}
                setPdfBase64Url={setPdfBase64Url}
                setPdfArrayBuffer={setPdfArrayBuffer}
                setIsUploadPdf={setIsUploadPdf}
                setSignerPos={setXyPosition}
                signerPos={xyPosition}
                allPages={allPages}
                setAllPages={setAllPages}
                setPageNumber={setPageNumber}
                isDisableEditTools={isCompleted}
              />
              <div className="w-full md:w-[95%]">
                <ModalUi
                  isOpen={isAlert.isShow}
                  title={isAlert?.header || ("alert")}
                  handleClose={() =>
                    setIsAlert({ isShow: false, alertMessage: "" })
                  }
                >
                  <div className="p-[20px] h-full">
                    <p>{isAlert.alertMessage}</p>
                  </div>
                </ModalUi>

                {/* this modal is used show this document is already sign */}
                <ModalUi
                  isOpen={showAlreadySignDoc.status}
                  title={("document-signed")}
                  handleClose={() => setShowAlreadySignDoc({ status: false })}
                >
                  <div className="p-[20px] h-full">
                    <p>{showAlreadySignDoc.mssg}</p>

                    <div className="h-[1px] w-full my-[15px] bg-[#9f9f9f]"></div>
                    <button
                      className="op-btn op-btn-ghost shadow-md"
                      onClick={() => setShowAlreadySignDoc({ status: false })}
                    >
                      {("close")}
                    </button>
                  </div>
                </ModalUi>
                <DropdownWidgetOption
                  type="checkbox"
                  title={("checkbox")}
                  showDropdown={isCheckbox}
                  setShowDropdown={setIsCheckbox}
                  handleSaveWidgetsOptions={handleSaveWidgetsOptions}
                  currWidgetsDetails={currWidgetsDetails}
                  setCurrWidgetsDetails={setCurrWidgetsDetails}
                  handleClose={handleCloseModal}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  fontColor={fontColor}
                  setFontColor={setFontColor}
                  isShowAdvanceFeature={false}
                />
                <PlaceholderCopy
                  isPageCopy={isPageCopy}
                  setIsPageCopy={setIsPageCopy}
                  xyPosition={xyPosition}
                  setXyPosition={setXyPosition}
                  allPages={allPages}
                  pageNumber={pageNumber}
                  signKey={signKey}
                  widgetType={widgetType}
                />
                {/* this is modal of signature pad */}
                {isSignPad && (
                  <SignPad
                    saveSignCheckbox={saveSignCheckbox}
                    setSaveSignCheckbox={setSaveSignCheckbox}
                    signatureTypes={signatureTypes}
                    isSignPad={isSignPad}
                    isStamp={isStamp}
                    setIsImageSelect={setIsImageSelect}
                    setIsSignPad={setIsSignPad}
                    setImage={setImage}
                    isImageSelect={isImageSelect}
                    imageRef={imageRef}
                    onImageChange={onImageChange}
                    setSignature={setSignature}
                    image={image}
                    onSaveImage={saveImage}
                    onSaveSign={saveSign}
                    defaultSign={defaultSignImg}
                    myInitial={myInitial}
                    setDefaultSignImg={setDefaultSignImg}
                    setMyInitial={setMyInitial}
                    isInitial={isInitial}
                    setIsInitial={setIsInitial}
                    setIsStamp={setIsStamp}
                    widgetType={widgetType}
                    currWidgetsDetails={currWidgetsDetails}
                    setCurrWidgetsDetails={setCurrWidgetsDetails}
                  />
                )}
                {/*render email component to send email after finish signature on document */}
                <EmailComponent
                  isEmail={isEmail}
                  setIsEmail={setIsEmail}
                  setSuccessEmail={setSuccessEmail}
                  pdfDetails={pdfDetails}
                  setIsAlert={setIsAlert}
                  setIsDownloadModal={setIsDownloadModal}
                />
                {/* pdf header which contain funish back button */}
                <Header
                  pageNumber={pageNumber}
                  allPages={allPages}
                  changePage={changePage}
                  embedWidgetsData={embedWidgetsData}
                  pdfDetails={pdfDetails}
                  isShowHeader={true}
                  currentSigner={true}
                  alreadySign={pdfUrl ? true : false}
                  isSignYourself={true}
                  setIsEmail={setIsEmail}
                  isCompleted={isCompleted}
                  handleRotationFun={handleRotationFun}
                  clickOnZoomIn={clickOnZoomIn}
                  clickOnZoomOut={clickOnZoomOut}
                  widgetsDetails={xyPosition}
                  setIsDownloadModal={setIsDownloadModal}
                  setIsUploadPdf={setIsUploadPdf}
                  pdfArrayBuffer={pdfArrayBuffer}
                  setPdfArrayBuffer={setPdfArrayBuffer}
                  setPdfBase64Url={setPdfBase64Url}
                  setSignerPos={setXyPosition}
                  signerPos={xyPosition}
                  pdfBase64={pdfBase64Url}
                  setIsDownloading={setIsDownloading}
                />
                <div ref={divRef} data-tut="reactourSecond" className="h-full">
                  {containerWH?.width && containerWH?.height && (
                    <RenderPdf
                      pageNumber={pageNumber}
                      pdfOriginalWH={pdfOriginalWH}
                      pdfNewWidth={pdfNewWidth}
                      drop={drop}
                      successEmail={successEmail}
                      nodeRef={nodeRef}
                      handleTabDrag={handleTabDrag}
                      handleStop={handleStop}
                      isDragging={isDragging}
                      setIsSignPad={setIsSignPad}
                      setIsStamp={setIsStamp}
                      handleDeleteSign={handleDeleteSign}
                      setSignKey={setSignKey}
                      pdfDetails={pdfDetails}
                      setIsDragging={setIsDragging}
                      xyPosition={xyPosition}
                      pdfRef={pdfRef}
                      pdfUrl={pdfUrl}
                      numPages={numPages}
                      pageDetails={pageDetails}
                      pdfLoad={pdfLoad}
                      setPdfLoad={setPdfLoad}
                      setXyPosition={setXyPosition}
                      index={index}
                      containerWH={containerWH}
                      setIsPageCopy={setIsPageCopy}
                      setIsInitial={setIsInitial}
                      setWidgetType={setWidgetType}
                      setSelectWidgetId={setSelectWidgetId}
                      selectWidgetId={selectWidgetId}
                      setIsCheckbox={setIsCheckbox}
                      setCurrWidgetsDetails={setCurrWidgetsDetails}
                      setValidateAlert={setValidateAlert}
                      handleTextSettingModal={handleTextSettingModal}
                      setScale={setScale}
                      scale={scale}
                      pdfBase64Url={pdfBase64Url}
                      fontSize={fontSize}
                      setFontSize={setFontSize}
                      fontColor={fontColor}
                      setFontColor={setFontColor}
                      isResize={isResize}
                      setIsResize={setIsResize}
                      divRef={divRef}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:w-[23%] bg-base-100 overflow-y-auto hide-scrollbar">
              <div className={`max-h-screen`}>
                {!isCompleted ? (
                  <div>
                    <WidgetComponent
                      pdfUrl={pdfUrl}
                      handleDivClick={handleDivClick}
                      handleMouseLeave={handleMouseLeave}
                      xyPosition={xyPosition}
                      isSignYourself={true}
                      addPositionOfSignature={addPositionOfSignature}
                      isMailSend={false}
                    // setSelectWidgetId={setSelectWidgetId}
                    />
                  </div>
                ) : (
                  <div>
                    <Signedby pdfDetails={pdfDetails[0]} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <ModalUi
        isOpen={validateAlert}
        title={("validation-alert")}
        handleClose={() => setValidateAlert(false)}
      >
        <div className="p-[20px] h-full">
          <p>{("validate-alert-mssg")}</p>

          <div className="h-[1px] w-full my-[15px] bg-[#9f9f9f]"></div>
          <button
            onClick={() => setValidateAlert(false)}
            type="button"
            className="op-btn op-btn-ghost shadow-md"
          >
            {("close")}
          </button>
        </div>
      </ModalUi>
      <RotateAlert
        showRotateAlert={showRotateAlert.status}
        setShowRotateAlert={setShowRotateAlert}
        handleRemoveWidgets={handleRemovePlaceholder}
      />
      <DownloadPdfZip
        setIsDownloadModal={setIsDownloadModal}
        isDownloadModal={isDownloadModal}
        pdfDetails={pdfDetails}
        isDocId={true}
        pdfBase64={pdfBase64Url}
      />
      <TextFontSetting
        isTextSetting={isTextSetting}
        setIsTextSetting={setIsTextSetting}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontColor={fontColor}
        setFontColor={setFontColor}
        handleSaveFontSize={handleSaveFontSize}
        currWidgetsDetails={currWidgetsDetails}
      />
    </DndProvider>
  );
}

export default SignYourSelf;
