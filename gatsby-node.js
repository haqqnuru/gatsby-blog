const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === "MarkdownRemark") {
    const { createNodeField } = actions;
    const slug = createFilePath({ node, getNode, basePath: "src/markdown-pages" });

    createNodeField({
      node,
      name: "slug",
      value: slug,
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  // Surface GraphQL errors in the terminal
  if (result.errors) {
    reporter.panicOnBuild(`🚨  GraphQL query failed`, result.errors);
    return;
  }

  const posts = result.data.allMarkdownRemark.edges;

  posts.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve("./src/templates/blog-post.js"),
      context: {
        slug: node.fields.slug,
      },
    });
  });
};
