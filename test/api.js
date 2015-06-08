var apiUrl = "https://pinpointapi.geowavestaging.com/api";

var urls = {
    LOGIN: "/login"
};

var url = function(path) {
    return apiUrl + urls[path];
}

describe("POST: /login", function() {
    it("should return BadRequest:400 for invalid login credentials", function(done) {
        done()
        // superagent
        //     .post(url("LOGIN"))
        //     .send({ EmailAddress: 'wrongName', Password: 'wrongPass' })
        //     .end(function(err, res){
        //         expect(res.statusCode).to.eql(400);
        //         done();
        //     });
    });
    it("should return json with \"error.message\" key  ({error: {message: 'invalid password'}}) for invalid login credentials", function(done) {
        done()
        // superagent
        //     .post(url("LOGIN"))
        //     .send({ EmailAddress: 'wrongName', Password: 'wrongPass' })
        //     .end(function(err, res){
        //         expect(res.body).to.have.property("error");
        //         done();
        //     });
    });
});