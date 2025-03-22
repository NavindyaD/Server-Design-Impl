const Country = Backbone.Model.extend({
    urlRoot: '/country',
  
    defaults: {
      name: '',
      capital: '',
      currency: '',
      languages: '',
      flag: '',
    },
  
    fetchCountryDetails: function(countryName) {
      return this.fetch({
        data: { countryName: countryName },
        reset: true
      });
    }
  });
  
  const countryModel = new Country();
  export default countryModel;
  