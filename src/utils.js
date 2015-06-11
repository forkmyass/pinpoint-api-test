import {url} from "./urls";
import {BadRequest} from "./errors";

var request = async (options) => {
    options.headers = options.headers || {};
    return new Promise((resolve, reject) => {
        superagent[options.method](options.url).set(options.headers).send(options.data).end((err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.status === 400) {
                return reject(new BadRequest(res.body));
            }

            if (res.status === 500) {
                return reject(new Error(res.body));
            }

            resolve(res.body);
        });
    });
}

var post = async (url, data, headers) => {
    let options = {url, data, headers}
    options.method = "post";
    return await request(options);
}

var login = async (EmailAddress, Password) => {
    return await post(url("LOGIN"), {EmailAddress, Password});
}

var createAdwertiser = async (data) => {
    let loginData = await login("admin", "password");

    return await post(url("CREATE_ADWERTISER"), data, {"Authorization-Token": loginData.User.AuthToken});
};

export default {request, post, login, createAdwertiser}