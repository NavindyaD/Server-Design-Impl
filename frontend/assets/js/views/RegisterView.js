const RegisterView = Backbone.View.extend({
    el: "#app",
    template: _.template(`
        <h2>Register</h2>
        <form id="registerForm">
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
        <p id="message"></p>
        <a href="#login">Already have an account? Login</a>
    `),
    events: {
        "submit #registerForm": "registerUser"
    },
    render() {
        this.$el.html(this.template());
    },
    registerUser(e) {
        e.preventDefault();
        let user = new UserModel();
        user.save({
            username: $("#username").val(),
            password: $("#password").val()
        }, {
            url: "http://localhost:5000/auth/register",
            type: "POST",
            success: (model, response) => {
                $("#message").text("Registered! Your API Key: " + response.apiKey);
            },
            error: () => {
                $("#message").text("Registration failed.");
            }
        });
    }
});
