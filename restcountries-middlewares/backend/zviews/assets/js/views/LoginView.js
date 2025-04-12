// views/loginView.js

var Backbone = require('backbone');
var _ = require('underscore');
var CountrySelectionView = require('./countrySelectionView');  // Import the new view

var LoginView = Backbone.View.extend({
    el: '#login-container',

    events: {
        'submit #login-form': 'handleLogin'
    },

    initialize: function() {
        this.countrySelectionView = new CountrySelectionView();  // Instantiate the CountrySelectionView
    },

    render: function() {
        this.$el.html('<form id="login-form">...</form>');  // Your login form HTML goes here
    },

    handleLogin: function(e) {
        e.preventDefault();

        // Assume the login is successful (authentication logic should be added)
        this.afterLogin();
    },

    afterLogin: function() {
        // Display country selection after login
        $('#login-container').hide();  // Hide the login form
        $('#country-selection').show();  // Show the country selection dropdown
        this.countrySelectionView.render();  // Call render on the CountrySelectionView
    }
});

module.exports = LoginView;
