const CountryView = Backbone.View.extend({
    el: "#app",
    template: _.template(`
        <h2>Fetch Country Information</h2>
        <input type="text" id="countryName" placeholder="Enter Country Name">
        <button id="fetchCountry">Fetch Data</button>
        <p id="countryData"></p>
    `),
    events: {
        "click #fetchCountry": "fetchCountry"
    },
    render() {
        this.$el.html(this.template());
    },
    fetchCountry() {
        let country = $("#countryName").val();
        $.ajax({
            url: `http://localhost:5000/api/country?country=${country}`,
            headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            success: (data) => {
                $("#countryData").html(`
                    <p>Name: ${data[0].name}</p>
                    <p>Capital: ${data[0].capital}</p>
                    <p>Currency: ${data[0].currency}</p>
                    <p>Languages: ${data[0].languages.join(", ")}</p>
                    <img src="${data[0].flag}" width="100">
                `);
            },
            error: () => {
                $("#countryData").text("Error fetching data.");
            }
        });
    }
});
