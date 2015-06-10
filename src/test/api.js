require("babelify/polyfill");
var apiUrl = "http://pinpointapi.geowavestaging.com/api";

var urls = {
    LOGIN: "/login",
    CREATE_ADWERTISER: "/admin/createadvertiser"
};

var url = (path) => {
    return apiUrl + urls[path];
};

var request = (options) => {
    options.headers = options.headers || {};
    return new Promise((resolve, reject) => {
        superagent[options.method](options.url).set(options.headers).send(options.data).end((err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.status === 400) {
                return reject(new BadRequest(res.body));
            }

            resolve(res.body);
        });
    });
}

var post = (url, data, headers) => {
    let options = {url, data, headers}
    options.method = "post";
    return request(options);
}

var login = (callback) => {
    return post(url("LOGIN"), {EmailAddress: 'admin', Password: 'password'})
};

var createAdwertiser = async (AuthToken) => {
    let loginData = await login();

    return post(url("CREATE_ADWERTISER"), {}, {"Authorization-Token": loginData.User.AuthToken});
              // "Name": "",
              // "Contact": "",
              // "Email": "",
              // "Password": "",
              // "Address": "",
              // "City": "",
              // "Postcode": "",
              // "Sales": "",
              // "Billing": "",
              // "Payment": "",
              // "Package": ""
};

describe("POST: /login", () => {
    it("should return BadRequest:400 for invalid login credentials", (done) => {
        superagent
            .post(url("LOGIN"))
            .send({ EmailAddress: 'wrongName', Password: 'wrongPass' })
            .end((err, res) => {
                if (err) return done(err);
                try {
                    expect(res.status).to.eql(400);
                } catch (e) {
                    done(e);
                }
                done();
            });
    });

    it("should return json with \"Error.Message\" keys {Error: {Message: 'invalid password'}} for invalid login credentials", (done) => {
        superagent
            .post(url("LOGIN"))
            .send({ EmailAddress: 'wrongName', Password: 'wrongPass' })
            .end((err, res) => {
                if (err) return done(err);
                try {
                    expect(res.body).to.have.property("Error");
                    expect(res.body.Error).to.have.property("Message");
                } catch (e) {
                    done(e);
                }
                done();
            });
    });

    it("should return User and Company info after success login", async (done) => {
        try {
            let data = await login();

            expect(data).to.have.property("Company");
            expect(data).to.have.property("User");
            expect(data.Company).to.be.an(Array);
            expect(data.Company[0]).to.have.property("CompanyName", "trinity mirror");
            expect(data.Company[0]).to.have.property("IsActive", true);
            expect(data.Company[0]).to.have.property("IsBlocked", false);
            expect(data.Company[0]).to.have.property("PersonCompanyID", 1);

            expect(data.User).to.have.property("AuthToken");
            expect(data.User.AuthToken).to.be.ok();
            expect(data.User).to.have.property("IsAdmin", true);
            expect(data.User).to.have.property("UserID", 1);
            done();
        } catch (e) {
            done(e);
        }
    });
});

describe("POST: /api/admin/createadwertiser", () => {
    it("should return BadRequest:400 for invalid adwertiser data", async () => {
        try {
            let adwertiser = await createAdwertiser();
        } catch (e) {
            expect(e).to.be.a(BadRequest);
        }
    });
    it("should return json with \"Error.Message\" keys {Error: {Message: \"firstName is too short\"}} for invalid adwertiser data", async () => {
        try {
            let adwertiser = await createAdwertiser();
        } catch (e) {
            expect(e.body).to.have.property("Error");
            expect(e.body.Error).to.have.property("Message");
        }
    });
});

class NotFound extends Error {
    constructor(path) {
        super(path);
        this.code = 404;
        this.path = path;
        Error.captureStackTrace(this);
    }
}

class Forbidden extends Error {
    constructor(path) {
        super(path);
        this.code = 403;
        this.path = path;
        Error.captureStackTrace(this);
    }
}

class Unauthorized extends Error {
    constructor(msg) {
        super(msg);
        this.message = msg || 'Unauthorized';
        this.code = 401;
        Error.captureStackTrace(this);
    }
}

class BadRequest extends Error {
    constructor(body) {
        super(body);
        this.message = 'Bad request';
        this.body = body;
        this.code = 400;
        Error.captureStackTrace(this);
    }
}
