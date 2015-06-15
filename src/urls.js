var apiUrl = "http://pinpointapi.geowavestaging.com/api";

var urls = {
    LOGIN: "/login",
    CREATE_ADVERTISER: "/admin/createadvertiser",
    EDIT_ADVERTISER: "/admin/editadvertiser",
    ADVERTISER_LIST: "/admin/getadvertiserlist",
    CAMPAIGN_LIST: "/admin/getcampaignlist",
    REPORT_LIST: "/admin/getreportlist",
    SUSPEND_ADVERTISER: "/admin/suspendadvertiser",
    ACTIVATE_ADVERTISER: "/admin/activateadvertiser",
    EMULATE_ADVERTISER: "/admin/emulateadvertiser"
};

var url = (path) => {
    return apiUrl + urls[path];
};

export default {url, apiUrl};