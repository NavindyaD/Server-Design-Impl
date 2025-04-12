import Backbone from 'backbone';
import $ from 'jquery';
import countryModel from '../models/Country';

const CountryView = Backbone.View.extend({
  el: '#country-details',

  events: {
    'submit #country-form': 'onSubmit',
  },

  initialize: function() {
    this.listenTo(countryModel, 'change', this.render);
  },

  render: function() {
    const countryData = countryModel.toJSON();
    this.$el.html(`
      <h2>${countryData.name}</h2>
      <p>Capital: ${countryData.capital}</p>
      <p>Currency: ${countryData.currency}</p>
      <p>Languages: ${countryData.languages}</p>
      <img src="${countryData.flag}" alt="Flag of ${countryData.name}" />
    `);
  },

  onSubmit: function(event) {
    event.preventDefault();
    const countryName = this.$('#country-name').val();
    countryModel.fetchCountryDetails(countryName);
  }
});

export default CountryView;
