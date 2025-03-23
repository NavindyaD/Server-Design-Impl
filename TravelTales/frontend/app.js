const Blog = Backbone.Model.extend({
    defaults: {
        title: '',
        content: '',
        country: ''
    }
});

const BlogCollection = Backbone.Collection.extend({
    model: Blog,
    url: 'http://localhost:5000/api/blogs'
});

const BlogView = Backbone.View.extend({
    tagName: 'div',
    className: 'blog-post',
    template: _.template(`
        <h2><%= title %></h2>
        <p><%= content %></p>
        <p><strong>Country:</strong> <%= country %></p>
    `),
    render() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

const BlogListView = Backbone.View.extend({
    el: '#app',
    initialize() {
        this.collection = new BlogCollection();
        this.collection.fetch({
            success: (collection) => {
                this.render();
            }
        });
    },
    render() {
        this.$el.empty();
        this.collection.each((blog) => {
            const view = new BlogView({ model: blog });
            this.$el.append(view.render().el);
        });
    }
});

new BlogListView();
