const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  blogs.forEach(blog => {
    total += blog.likes
  })
  return total
}

const favoriteBlog = (blogs) => {
 const max = Math.max(...blogs.map(blog => blog.likes))
 const mostLikes = blogs.find(blog => blog.likes === max)
 return {
   title: mostLikes.title,
   author: mostLikes.author,
   likes: mostLikes.likes
 }
}

const mostBlogs = (blogs) => {
  const output = _.countBy(blogs, blog => blog.author)
  const last = Object.keys(output)[Object.keys(output).length-1]
  const returnedAuthor = {
    author: last,
    blogs: output[last]
  }

  return returnedAuthor
}

const summedAuthor = []
const mostLikes = (blogs) => {
  const output = _.groupBy(blogs, blog => blog.author)
  _.forEach(output, (value, key) => {
    let total = 0
    output[key].forEach(author => {
      total += author.likes
    })
    summedAuthor.push({
      author: key,
      likes: total
    })
  })
  return {author, likes} = favoriteBlog(summedAuthor)
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}