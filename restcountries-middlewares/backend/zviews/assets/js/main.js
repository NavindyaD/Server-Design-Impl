import Backbone from 'backbone';
import $ from 'jquery';
import CountryView from '../views/CountryView';

$(document).ready(function() {
  const countryView = new CountryView();
  Backbone.history.start();

  // Redirect or handle logic after login
  if (window.location.pathname === '/country') {
    countryView.render(); // Render the country details page
  }
});
