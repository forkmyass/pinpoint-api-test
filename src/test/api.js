require("babelify/polyfill");
import {BadRequest, ServerError, Unauthorized, Forbidden} from "../errors";
import {request, post, login, createAdwertiser, editAdwertiser, adwertiserList, data} from "../utils";
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

        it("should return User and Company info after success adwertiser login", async (done) => {
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
    describe("POST: /api/admin/getadwertiserlist", () => {
        it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
            try {
                let adwertisers = await post(url("ADWERTISER_LIST"));
                done(new Error("Unauthorized:401 was expected"));
            } catch (e) {
                expect(e).to.be.a(Unauthorized);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
                done();
            }
        });

        it("should return OK:200 with adwertisers list", async (done) => {
            try {
                let token = await login("admin", "password", true);
                let adwertisers = await post(url("ADWERTISER_LIST"), {}, {"Authorization-Token": token});
                expect(adwertisers).to.be.ok();
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
                let campaigns = await post(url("CAMPAIGN_LIST"), {}, {"Authorization-Token": token});
                expect(campaigns).to.be.ok();
                expect(campaigns).to.be.an(Array);
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

describe("AdminAdwertiser", () => {
    describe("POST: /api/admin/createadwertiser", () => {
        it("should return BadRequest:400 for invalid adwertiser data", async () => {
            try {
                let adwertiser = await createAdwertiser();
                done(new Error("Server should respond with BadRequest:400 instead of OK:200"));
            } catch (e) {
                expect(e).to.be.a(BadRequest);
                expect(e.body).to.have.property("Error");
                expect(e.body.Error).to.have.property("Message");
            }
        });

        it("should return adwertiser info after creation adwertiser by admin", async (done) => {
            try {
                let adwertiser = await createAdwertiser({
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
                });

                expect(adwertiser).to.be.ok();
                expect(adwertiser).to.have.property("Package");
                expect(adwertiser).to.have.property("Payment");

                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe("POST: /api/admin/editadwertiser", () => {
        it("should edit adwertiser info  by admin", async (done) => {
            try {
                let list = await adwertiserList();
                let adwertiser = list[0];

                let editedAdwertiser = await editAdwertiser(adwertiser.id, {
                    Name: "edited",
                    Contact: "edited",
                    Email: data.adwertiser.Email,
                    PersonCompanyID: adwertiser.PersonCompanyID
                });
                // expect(adwertiser).to.be.ok();
                // expect(adwertiser).to.have.property("Name", "edited");
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe("POST: /api/admin/emulateadvertiser", () => {
    });

    describe("POST: /api/admin/suspendadwertiser", () => {
    });

});

