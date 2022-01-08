const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, blog) => prev + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((curr, blog) => blog.likes > curr.likes ? blog : curr)
}

const mostLikes = (blogs) => {
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
  dummy, totalLikes, favoriteBlog, mostLikes
}