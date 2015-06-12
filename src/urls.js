var apiUrl = "http://pinpointapi.geowavestaging.com/api";

var urls = {
    LOGIN: "/login",
    CREATE_ADWERTISER: "/admin/createadvertiser",
    EDIT_ADWERTISER: "/admin/editadvertiser",
    ADWERTISER_LIST: "/admin/getadvertiserlist"
};

var url = (path) => {
    return apiUrl + urls[path];
};

export default {url, apiUrl};