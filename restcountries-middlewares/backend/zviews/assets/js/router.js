var Router = Backbone.Router.extend({
    routes: {
      'login': 'login',
      'register': 'register',
      'apikey': 'apikey'
    },
    login: function() {
      var loginView = new LoginView();
      $('#app').html(loginView.render().el);
    },
    register: function() {
      var registerView = new RegisterView();
      $('#app').html(registerView.render().el);
    },
    apikey: function() {
      var apiKeyView = new APIKeyView();
      $('#app').html(apiKeyView.render().el);
    }
  });
  