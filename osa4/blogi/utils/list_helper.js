const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, blog) => prev + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((curr, blog) => blog.likes > curr.likes ? blog : curr)
}

const mostBlogs = (blogs) => {
  // authors = { authorName: no. likes }
  const authors = blogs.reduce((result, blog) => ({
    ...result, 
    [blog.author]: (result[blog.author] ?? 0) + 1
  }), {})

  return Object.entries(authors).reduce((curr, [author, blogs]) => 
    blogs > curr.blogs ? { author, blogs } : curr,
    /* Initial value */ { blogs: 0 })
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  // authors = { authorName: no. likes }
  const authors = blogs.reduce((result, blog) => ({
    ...result, 
    [blog.author]: (result[blog.author] ?? 0) + blog.likes
  }), {})

  return Object.entries(authors).reduce((curr, [author, likes]) => 
    likes > curr.likes ? { author, likes } : curr,
  { likes: 0 })
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}