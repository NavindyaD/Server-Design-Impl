var UserModel = Backbone.Model.extend({
    urlRoot: '/auth',
    defaults: {
      username: '',
      password: '',
      apiKey: ''
    }
  });
  