## Hosting

Hosted at: https://lolorss.onrender.com/


## Technologies Used

For this project, I decided to go with pure HTML, CSS and JS to make sure that I comply with the given instructions. Additionally, as it´s a simple website, there is no need for a complex framework or library.

For the proxy server, which is needed because of CORS, I went with node.js and express.


## Running locally

Assuming NPM is installed:

1. clone the repository
2. in the cloned directory, run ``` npm i ```
3. run ```npm run start ```

## Notes

When opening the deployed link, which I have mentioned above, the server might take some time to start up and respond.

The news articles of different feeds are separated by a gap. Articles in each feed are sorted so that newer articles are displayed first.

For real deployment, a bundler should be used to reduce redundant HTTPS requests for JS and CSS files.

When it comes to filtering articles, articles will be displayed unless all of its categories are unchecked in the filtering area. For example, if an article has 4 categories, the article will be displayed until all 4 categories are unchecked. Therefore unchecking a single category filter might not always bring noticeable results.







