const getURL = (url: string): string => {
    return "http://localhost:5000/api/v1/digital-signature" + url;
  };
  
  export const API_ROUTES = {
    SAVE_FILE: getURL("/files/save"),
    AFTER_SAVE_DOCUMENT: getURL("/documents/after-save"),
    GET_DOCUMENT: (id: string) => getURL(`/documents/${id}`),
    GET_USER_DETAILS: '/api/v1/user/get-user-details',
    SAVE_PDF: getURL("/documents/save-pdf"),
    FORWARD_DOC: getURL("/documents/forward-doc"),
    REGISTER: getURL('/auth/register'),
    SIGNATURE: getURL('/signatures')
  };
  