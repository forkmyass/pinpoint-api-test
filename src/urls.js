var apiUrl = "http://pinpointapi.geowavestaging.com/api";

var urls = {
    LOGIN: "/login",
    CREATE_ADWERTISER: "/admin/createadvertiser"
};

var url = (path) => {
    return apiUrl + urls[path];
};

export default {url, apiUrl};