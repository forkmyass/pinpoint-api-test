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
                try {
                    expect(res.status).to.eql(400);
                } catch (e) {
                    done(e);
                }
                done();
            });
    });
    it("should return json with \"Error.Message\" key  ({Error: {Message: 'invalid password'}}) for invalid login credentials", function(done) {
        superagent
            .post(url("LOGIN"))
            .send({ EmailAddress: 'wrongName', Password: 'wrongPass' })
            .end(function(err, res){
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
});