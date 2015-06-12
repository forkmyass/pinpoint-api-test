import {url} from "./urls";
import {BadRequest, ServerError, Unauthorized} from "./errors";

let data = {
    adwertiser: {
        "Name": "SergeyVayser",
        "Contact": "test",
        "Email": "wice242@gmail.com",
        "Password": "qQ190301",
        "Address": "holoseevskoe ave",
        "City": "Kiev",
        "Postcode": "NE11JF",
        "Sales": "test",
        "Billing": "test",
        "Payment": "test",
        "Package": "test"
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

let createAdwertiser = async (data) => {
    let loginData = await login("admin", "password");
    return await post(url("CREATE_ADWERTISER"), data, {"Authorization-Token": loginData.User.AuthToken});
};

let editAdwertiser = async (id, data) => {
    let loginData = await login("admin", "password");
    return await post(url("EDIT_ADWERTISER"), data, {"Authorization-Token": loginData.User.AuthToken});
}

export default {request, post, login, createAdwertiser, editAdwertiser, data}