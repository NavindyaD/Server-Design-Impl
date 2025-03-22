var RegisterView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#register-template').html()),
    events: {
      'submit #register-form': 'registerUser'
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    registerUser: function(event) {
      event.preventDefault();
      var username = $('#username').val();
      var password = $('#password').val();
  
      var user = new UserModel();
      user.save({ username: username, password: password }, {
        success: function() {
          alert('Registered successfully!');
          Backbone.history.navigate('', { trigger: true });
        },
        error: function() {
          alert('Registration failed!');
        }
      });
    }
  });
  