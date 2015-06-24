import {url} from "./urls";
import {BadRequest, ServerError, Unauthorized, Forbidden} from "./errors";

let data = {
    advertiser: {
        "Name": "SergeyVayser",
        "Contact": "test",
        "Email": "wice242@gmail.com",
        "Password": "qQ190301",
        "Address1": "holoseevskoe ave",
        "Address2": "holoseevskoe ave",
        "Address3": "holoseevskoe ave",
        "Postcode": "NE11JF",
        "Reference": "test",
        "InvoiceRef": "test",
        "PaymentID": 2
    }
}

let request = (options) => {
    options.headers = options.headers || {};
    return new Promise((resolve, reject) => {
        superagent[options.method](options.url).set(options.headers).send(options.data).end((err, res) => {
            if (err) {
                return reject(err);
            }

            if (res.status === 400) {
                return reject(new BadRequest(res.body));
            }

            if (res.status === 401) {
                return reject(new Unauthorized(res.body));
            }

            if (res.status === 403) {
                return reject(new Forbidden(res.body));
            }

            if (res.status === 500) {
                return reject(new ServerError(res.body));
            }

            resolve(res.body);
        });
    });
}

let post = async (url, data, headers) => {
    let options = {url, data, headers}
    options.method = "post";
    return await request(options);
}

let login = async (EmailAddress, Password, justToken) => {
    let data = await post(url("LOGIN"), {EmailAddress, Password});
    if (justToken) return data.User.AuthToken;
    return data;
}

let createAdvertiser = async (data) => {
    let loginData = await login("admin", "password");
    return await post(url("CREATE_ADVERTISER"), data, {"Authorization-Token": loginData.User.AuthToken});
};

let editAdvertiser = async (data) => {
    let loginData = await login("admin", "password");
    return await post(url("EDIT_ADVERTISER"), data, {"Authorization-Token": loginData.User.AuthToken});
}

let advertiserList = async () => {
    let token = await login("admin", "password", true);
    let data =  await post(url("ADVERTISER_LIST"), {IsActive: true}, {"Authorization-Token": token});
    return data.Advertiser
}

let emulateAdvertiser = async (PersonCompanyID) => {
    let token = await login("admin", "password", true);
    let data =  await post(url("EMULATE_ADVERTISER"), {PersonCompanyID: PersonCompanyID}, {"Authorization-Token": token});
    return data
}

let suspendAdvertiser = async (PersonCompanyID) => {
    let token = await login("admin", "password", true);
    let data =  await post(url("SUSPEND_ADVERTISER"), {PersonCompanyID}, {"Authorization-Token": token});
    return data
}

let activateAdvertiser = async (PersonCompanyID) => {
    let token = await login("admin", "password", true);
    let data = await post(url("ACTIVATE_ADVERTISER"), {PersonCompanyID}, {"Authorization-Token": token});
    return data;
}

let getAdvertisers = async () => {
    let token = await login("admin", "password", true);
    let result = await post(url("ADVERTISER_LIST"), {}, {"Authorization-Token": token});
    return result.Advertiser;
}

export default {
    request, 
    post, 
    login, 
    createAdvertiser, 
    editAdvertiser, 
    advertiserList, 
    activateAdvertiser,
    emulateAdvertiser, 
    suspendAdvertiser, 
    getAdvertisers,
    data
}