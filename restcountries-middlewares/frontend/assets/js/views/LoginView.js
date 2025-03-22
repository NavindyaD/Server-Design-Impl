const LoginView = Backbone.View.extend({
    el: "#app",
    template: _.template(`
        <h2>Login</h2>
        <form id="loginForm">
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <p id="message"></p>
        <a href="#register">New user? Register here</a>
    `),
    events: {
        "submit #loginForm": "loginUser"
    },
    render() {
        this.$el.html(this.template());
    },
    loginUser(e) {
        e.preventDefault();
        $.ajax({
            url: "http://localhost:5000/auth/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: $("#username").val(),
                password: $("#password").val()
            }),
            success: (response) => {
                localStorage.setItem("token", response.token);
                localStorage.setItem("apiKey", response.apiKey);
                $("#message").text("Login successful! API Key: " + response.apiKey);
                window.location.hash = "apikey";
            },
            error: () => {
                $("#message").text("Login failed.");
            }
        });
    }
});
