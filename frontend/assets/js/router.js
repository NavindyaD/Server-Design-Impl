const AppRouter = Backbone.Router.extend({
    routes: {
        "": "login",
        "register": "register",
        "login": "login",
        "apikey": "apikey",
        "country": "country"
    },
    register() { new RegisterView().render(); },
    login() { new LoginView().render(); },
    apikey() { new APIKeyView().render(); },
    country() { new CountryView().render(); }
});
