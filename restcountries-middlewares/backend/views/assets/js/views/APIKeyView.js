var APIKeyView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#apikey-template').html()),
    events: {
      'click #generate-apikey': 'generateAPIKey'
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    generateAPIKey: function() {
      $.ajax({
        url: '/auth/generate-api-key',
        method: 'POST',
        success: function(response) {
          $('#api-key').text(response.apiKey);
        },
        error: function() {
          alert('API Key generation failed!');
        }
      });
    }
  });
  