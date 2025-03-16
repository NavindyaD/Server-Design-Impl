const APIKeyView = Backbone.View.extend({
    el: "#app",
    template: _.template(`
        <h2>Your API Key</h2>
        <p id="apiKeyText"></p>
        <a href="#country">Fetch Country Info</a>
        <button id="logout">Logout</button>
    `),
    events: {
        "click #logout": "logoutUser"
    },
    render() {
        this.$el.html(this.template());
        $("#apiKeyText").text("API Key: " + localStorage.getItem("apiKey"));
    },
    logoutUser() {
        localStorage.clear();
        window.location.hash = "login";
    }
});
