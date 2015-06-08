var apiUrl = "http://pinpointapi.geowavestaging.com/api";

var urls = {
    LOGIN: "/login"
};

var url = function(path) {
    return apiUrl + urls[path];
}

describe("POST: /login", function() {
    this.timeout(10000);
    it("should return BadRequest:400 for invalid login credentials", function(done) {
        superagent
            .post(url("LOGIN"))
            .send({ EmailAddress: 'wrongName', Password: 'wrongPass' })
            .end(function(err, res){
                if (err) return done(err);
                expect(res.statusCode).to.eql(400);
                done();
            });
    });
    it("should return json with \"error.message\" key  ({error: {message: 'invalid password'}}) for invalid login credentials", function(done) {
        superagent
            .post(url("LOGIN"))
            .send({ EmailAddress: 'wrongName', Password: 'wrongPass' })
            .end(function(err, res){
                if (err) return done(err);
                expect(res.body).to.have.property("error");
                done();
            });
    });
});