// views/countrySelectionView.js

var Backbone = require('backbone');
var _ = require('underscore');

var CountrySelectionView = Backbone.View.extend({
    el: '#country-selection',

    events: {
        'change #country-dropdown': 'onCountryChange'
    },

    initialize: function() {
        this.countries = []; // Array to hold country data
        this.fetchCountries();
    },

    fetchCountries: function() {
        var self = this;
        $.ajax({
            url: 'https://restcountries.com/v3.1/all',  // API to get all countries
            method: 'GET',
            success: function(data) {
                self.countries = data;
                self.render();
            },
            error: function() {
                alert('Failed to load countries');
            }
        });
    },

    render: function() {
        var countryOptions = this.countries.map(function(country) {
            return '<option value="' + country.name.common + '">' + country.name.common + '</option>';
        }).join('');

        var dropdownHTML = '<select id="country-dropdown">' +
            '<option value="">Select a country</option>' +
            countryOptions +
            '</select>';
        
        this.$el.html(dropdownHTML);
    },

    onCountryChange: function(event) {
        var selectedCountry = event.target.value;
        alert('You selected: ' + selectedCountry);
    }
});

module.exports = CountrySelectionView;
