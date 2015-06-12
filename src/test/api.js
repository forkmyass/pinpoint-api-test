require("babelify/polyfill");
import {BadRequest, ServerError, Unauthorized} from "../errors";
import {request, post, login, createAdwertiser, editAdwertiser, data} from "../utils";
import {url, apiUrl} from "../urls";

describe("POST: /login", () => {
    it("should return BadRequest:400 for invalid login credentials", async (done) => {
        try {
            await login("wrongEmail", "wrongPass")
            done(new Error("Server should  respond with BadRequest:400 instead of OK:200"));
        } catch (e) {
            expect(e).to.be.a(BadRequest);
            done();
        }
    });

    it("should return json with \"Error.Message\" keys {Error: {Message: 'invalid password'}} for invalid login credentials", async (done) => {
        try {
            await login("wrongEmail", "wrongPass")
            done(new Error("Server should respond with BadRequest:400 instead of OK:200"));
        } catch (e) {
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

describe("POST: /api/admin/getadwertiserlist", () => {
    it("should return Unauthorized:401 for Unauthorized admin", async (done) => {
        try {
            let adwertisers = await post(url("ADWERTISER_LIST"));
            done(new Error("Unauthorized:401 was expected"));
        } catch (e) {
            expect(e).to.be.a(Unauthorized);
            done();
        }
    });

    it("should return OK:200 with adwertisers list", async (done) => {
        try {
            let token = login("admin", "password", true);
            let adwertisers = await post(url("ADWERTISER_LIST"), {}, {"Authorization-Token": token});
            expect(adwertisers).to.be.ok();
        } catch (e) {
            done(e);
        }
    });
});

describe("POST: /api/admin/createadwertiser", () => {
    it("should return BadRequest:400 for invalid adwertiser data", async () => {
        try {
            let adwertiser = await createAdwertiser();
            done(new Error("Server should respond with BadRequest:400 instead of OK:200"));
        } catch (e) {
            expect(e).to.be.a(BadRequest);
        }
    });

    it("should return json with \"Error.Message\" keys {Error: {Message: \"firstName is too short\"}} for invalid adwertiser data", async () => {
        try {
            let adwertiser = await createAdwertiser({});
            done(new Error("Server should respond with BadRequest:400 instead of OK:200"));
        } catch (e) {
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

    it.skip("should edit adwertiser info  by admin", async (done) => {
        try {
            let token = login("admin", "password", true);
            let adwertiserList = await post(url("ADWERTISER_LIST"), {}, {"Authorization-Token": token});
            // let adwertiser = await createAdwertiser(data.adwertiser);
            // let editedAdwertiser = await editAdwertiser(adwertiser.id, {
            //     Name: "edited",
            //     Contact: "edited",
            //     Email: data.adwertiser.Email
            // });

            // console.log(editedAdwertiser);

            // expect(adwertiser).to.be.ok();
            // expect(adwertiser).to.have.property("Name", "edited");
            done();
        } catch (e) {
            console.log(e);
            done(e);
        }
    });
});