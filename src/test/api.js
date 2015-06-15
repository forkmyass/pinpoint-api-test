require("babelify/polyfill");
import {BadRequest, ServerError, Unauthorized, Forbidden} from "../errors";
import {
    request, 
    post, 
    login, 
    createAdvertiser, 
    editAdvertiser, 
    suspendAdvertiser,
    advertiserList, 
    emulateAdvertiser, 
    data
} from "../utils";

import {url, apiUrl} from "../urls";

describe("Login", () => {
    describe("POST: /login", () => {
        it("should return BadRequest:400 for invalid login credentials", async (done) => {
            try {
                await login("wrongEmail", "wrongPass")
                done(new Error("Server should  respond with BadRequest:400 instead of OK:200"));
            } catch (e) {
                expect(e).to.be.a(BadRequest);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return User and Company info after success advertiser login", async (done) => {
            try {
                let data = await login("multiplelogin", "password");

                expect(data).to.have.property("Company");
                expect(data).to.have.property("User");
                expect(data.Company).to.be.an(Array);
                expect(data.Company[0]).to.have.property("CompanyName");
                expect(data.Company[0]).to.have.property("IsActive");
                expect(data.Company[0]).to.have.property("IsBlocked");
                expect(data.Company[0]).to.have.property("PersonCompanyID", 5);

                expect(data.User).to.have.property("AuthToken");
                expect(data.User.AuthToken).to.be.ok();
                expect(data.User).to.have.property("IsAdmin", false);
                expect(data.User).to.have.property("UserID", 5);
                done();
            } catch (e) {
                done(e);
            }
        });

        it("should return User and Company info after success admin login", async (done) => {
            try {
                let data = await login("admin", "password");

                expect(data).to.have.property("Company");
                expect(data).to.have.property("User");
                expect(data.Company).to.be.an(Array);
                console.log(data);
                expect(data.Company[0]).to.have.property("CompanyName");
                expect(data.Company[0]).to.have.property("IsActive");
                expect(data.Company[0]).to.have.property("IsBlocked");
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
});

describe("AdminList", () => {
    describe("POST: /api/admin/getadvertiserlist", () => {
        it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
            try {
                let advertisers = await post(url("ADVERTISER_LIST"));
                done(new Error("Unauthorized:401 was expected"));
            } catch (e) {
                expect(e).to.be.a(Unauthorized);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return OK:200 with advertisers list", async (done) => {
            try {
                let token = await login("admin", "password", true);
                let advertisers = await post(url("ADVERTISER_LIST"), {}, {"Authorization-Token": token});
                console.log(advertisers);
                expect(advertisers).to.be.ok();
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe("POST: /api/admin/getcampaignlist", () => {
        it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
            try {
                let campaigns = await post(url("CAMPAIGN_LIST"));
                done(new Error("Unauthorized:401 was expected"));
            } catch (e) {
                expect(e).to.be.a(Unauthorized);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return OK:200 with campaign list e.g [{}, {}, {}] or empty list []", async (done) => {
            try {
                let token = await login("admin", "password", true);
                let result = await post(url("CAMPAIGN_LIST"), {}, {"Authorization-Token": token});
                expect(result.Campaign).to.be.ok();
                expect(result.Campaign).to.be.an(Array);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe("POST: /api/admin/getreportlist", () => {
        it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
            try {
                let reports = await post(url("REPORT_LIST"));
                done(new Error("Unauthorized:401 was expected"));
            } catch (e) {
                expect(e).to.be.a(Unauthorized);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return OK:200 with report property {Report:[{CSV, Date, Description, Name}, {...}]", async (done) => {
            try {
                let token = await login("admin", "password", true);
                let data = await post(url("REPORT_LIST"), {}, {"Authorization-Token": token});
                expect(data).to.be.ok();
                expect(data.Report).to.be.an(Array);
                expect(data.Report[0]).to.have.property("CSV");
                expect(data.Report[0]).to.have.property("Date");
                expect(data.Report[0]).to.have.property("Description");
                expect(data.Report[0]).to.have.property("Name");
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});

describe("AdminAdvertiser", () => {
    describe("POST: /api/admin/createadvertiser", () => {
        it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
            try {
                let advertiser = await post(url("CREATE_ADVERTISER"));
                done(new Error("Unauthorized:401 was expected"));
            } catch (e) {
                expect(e).to.be.a(Unauthorized);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return BadRequest:400 for invalid advertiser data", async () => {
            try {
                let advertiser = await createAdvertiser();
                done(new Error("Server should respond with BadRequest:400 instead of OK:200"));
            } catch (e) {
                expect(e).to.be.a(BadRequest);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
            }
        });

        it("should return advertiser info after creation advertiser by admin", async (done) => {
            try {
                let advertiser = await createAdvertiser(data.advertiser);

                expect(advertiser).to.be.ok();
                expect(advertiser).to.have.property("Package");
                expect(advertiser).to.have.property("Payment");

                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe("POST: /api/admin/editadvertiser", () => {
        it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
            try {
                let editedAdvertiser = await post(url("EDIT_ADVERTISER"));
            } catch (e) {
                expect(e).to.be.a(Unauthorized);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return BadRequest:400 for invalid advertiser data", async () => {
            try {
                let list = await advertiserList();
                let advertiser = list[0];

                let editedAdvertiser = await editAdvertiser(advertiser.id, {});
                done(new Error("Server should  respond with BadRequest:400 instead of OK:200"));
            } catch (e) {
                expect(e).to.be.a(BadRequest);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
            }
        });

        it("should edit advertiser info  by admin", async (done) => {
            try {
                let list = await advertiserList();
                let advertiser = list[0];

                let editedAdvertiser = await editAdvertiser(advertiser.id, {
                    Name: "edited",
                    Contact: "edited",
                    Email: data.advertiser.Email,
                    PersonCompanyID: advertiser.PersonCompanyID
                });
                // expect(advertiser).to.be.ok();
                // expect(advertiser).to.have.property("Name", "edited");
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe("POST: /api/admin/emulateadvertiser", () => {
        it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
            try {
                let data = await post(url("EMULATE_ADVERTISER"));
                done(new Error("Server should respond with Unauthorized:401 instead of OK:200"));
            } catch (e) {
                expect(e).to.be.a(Unauthorized);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return BadRequest:400 for invalid advertiser data", async (done) => {
            try {
                let data = await emulateAdvertiser();
                done(new Error("Server should  respond with BadRequest:400 instead of OK:200"));
            } catch (e) {
                console.log(e);
                expect(e).to.be.a(BadRequest);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return OK:200 status with User and Company Info", async (done) => {
            try {
                let data = await emulateAdvertiser(5);
                expect(data).to.have.property("Company");
                expect(data).to.have.property("User");
                expect(data.Company).to.have.property("CompanyName");
                expect(data.Company).to.have.property("IsActive");
                expect(data.Company).to.have.property("IsBlocked");
                expect(data.Company).to.have.property("PersonCompanyID", 5);

                expect(data.User).to.have.property("AuthToken");
                expect(data.User.AuthToken).to.be.ok();
                expect(data.User).to.have.property("IsAdmin", false);
                expect(data.User).to.have.property("UserID", 5);
                done();
                done();
            } catch (e) {
                done(e);
            }
        });

    });

    describe("POST: /api/admin/suspendadvertiser", () => {
        it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
            try {
                let data = await post(url("SUSPEND_ADVERTISER"));
                done(new Error("Server should respond with Unauthorized:401 instead of OK:200"));
            } catch (e) {
                expect(e).to.be.a(Unauthorized);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return BadRequest:400 for invalid advertiser data", async (done) => {
            try {
                let data = await suspendAdvertiser();
                done(new Error("Server should  respond with BadRequest:400 instead of OK:200"));
            } catch (e) {
                console.log(e);
                expect(e).to.be.a(BadRequest);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it.skip("should return 200:OK after admin suspend advertiser", async (done) => {
            try {
                let advertiser = await createAdvertiser(data.advertiser);
                console.log(advertiser);
                let result = await suspendAdvertiser(advertiser.id);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});

