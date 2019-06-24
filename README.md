# Editorial

This is an Editorial fork.  

![screenshot](https://user-images.githubusercontent.com/120485/49328081-0e192680-f59d-11e8-808a-e6d6bcfa8419.png)

With:  
- top level navigation and social links.  
- site options moved to right side.  

and few fresh and useful functionalities added:  

### Bookmark  
The library bookmark.js allows to keep articles as bookmarked links within the site. It's a link saving feature, using cookies to store bookmarked articles.  
A new section in the navigation sidebar appears with the links to the saved articles.

### Search
Blog search feature on top of [ghost-search](https://github.com/HauntedThemes/ghost-search), provides a fast search functionality even for an extense blog.  

The search funcitonality has been added to the base files.
Therefore, results are presented in the current page, page-section, home, post, tag, as a emerging section below the main header.  

Search results dissapear as the search inputs gets empty.

### Similar posts
Similar posts feature has been added by default.  
Those can be seen in post page `post.hbs` and the newly added `page-section.hbs` where few posts about each seaction are shown.  

## Extend @config

Add the new key to allowed_keys in the following file of the ghost distribution: `core/server/services/themes/config/index.js`


```allowedKeys = ['posts_per_page', 'image_sizes' , 'img_bucket'];
```

Then allow the getter for the new key in:
`core/server/services/themes/middleware.js`

```themeData.img_bucket = activeTheme.get().config('img_bucket');
``


**The new files are:**

- `partials/search.hbs` - The search results view
- `page-section.hbs` - Used as a resume of tags (*called sections*)

**...**

Editorial provides news-oriented design built around a dynamic 'locking' sidebar (try the toggle to see it in action!) and purpose built for content-centric sites. Originally created by [@ajlkn](https://twitter.com/ajlkn) for [HTML5 UP](https://html5up.net) and later ported to [Ghost](https://ghost.org)

**Demo: https://editorial.ghost.io**

&nbsp;

Ghost uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

We've documented our default theme pretty heavily so that it should be fairly easy to work out what's going on just by reading the code and the comments. Once you feel comfortable with how everything works, we also have full [theme API documentation](https://themes.ghost.org) which explains every possible Handlebars helper and template.

**The main files are:**

- `default.hbs` - The main template file
- `index.hbs` - Used for the home page
- `post.hbs` - Used for individual posts
- `page.hbs` - Used for individual pages
- `tag.hbs` - Used for tag archives
- `author.hbs` - Used for author archives

One neat trick is that you can also create custom one-off templates just by adding the slug of a page to a template file. For example:

- `page-about.hbs` - Custom template for the `/about/` page
- `tag-news.hbs` - Custom template for `/tag/news/` archive
- `author-ali.hbs` - Custom template for `/author/ali/` archive


# Development

This implementation tries to stay as true as possible to the original template without making too many modifications. The original code is unmodified, preserving the ability to update it later.

There are two main changes compared to the original template files:

- The original template contained separate `/assets` and `/images` directories. Ghost Themes require that all assets be nested under a top-level `/assets` directory, so these are moved to `/assets/main` and `/assets/images`, respectively.
- In order to make minor modifications and add some new custom styles, one additional SaSS file is added under `/assets/main/sass/layout/ghost.sass` and included at the bottom of the `main.sass` file.

To work on styles in this theme, you'll need to run a local development environment to build/watch for changes. Once cloned and installed with npm/yarn, the following `gulp` build tasks are available:

```bash
# Build files locally and watch for changes
gulp

# Build production zip locally and save to /dist
gulp zip

# Run compatibility test against latest version of Ghost
yarn test
```

Original template files and design by [@ajlkn](https://twitter.com/ajlkn)


# Copyright & License

Copyright (c) 2013-2019 [HTML5 UP](https://htmlup.net) & [Ghost Foundation](https://ghost.org) - This theme is licensed under both the [MIT and Creative Commons Attribution 3.0](LICENSE). Please note that the terms of the Creative Commons license require that you maintain the footer attribution to freely use this theme.
