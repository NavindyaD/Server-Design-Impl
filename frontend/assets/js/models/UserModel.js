const UserModel = Backbone.Model.extend({
    urlRoot: "http://localhost:5000/auth",
    defaults: {
        username: "",
        password: "",
        apiKey: ""
    }
});
