$(document).ready(function() {
    const CountryModel = Backbone.Model.extend({
        urlRoot: '/api/country',
        defaults: {
            name: '',
            currency: '',
            capital: '',
            languages: [],
            flag: ''
        }
    });

    const CountryView = Backbone.View.extend({
        el: '#country-info',
        initialize: function() {
            this.listenTo(this.model, 'sync', this.render);
        },
        render: function() {
            const data = this.model.toJSON();
            this.$el.html(`
                <h2>${data.name}</h2>
                <img src="${data.flag}" alt="Flag" />
                <p>Currency: ${data.currency}</p>
                <p>Capital: ${data.capital}</p>
                <p>Languages: ${data.languages.join(', ')}</p>
            `);
            return this;
        },
        fetchCountryData: function(country) {
            this.model.fetch({
                data: { country: country },
                headers: {
                    'Authorization': 'Bearer YOUR_TOKEN_HERE',
                    'X-API-Key': 'YOUR_API_KEY_HERE'
                }
            });
        }
    });

    const countryModel = new CountryModel();
    const countryView = new CountryView({ model: countryModel });

    // Sample fetch call with "Canada"
    countryView.fetchCountryData('Canada');
});
