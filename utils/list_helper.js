const dummy = (blogs) => {
    return 1
}

const likeCounter = (blogs) => {
    const sum = blogs.reduce((sum,blog) => blog.likes+sum,0)
    return sum
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((fav,blog) => fav.likes>blog.likes?fav:blog)
     delete favorite._id
     delete favorite.url
     delete favorite.__v
     
     return favorite
}

const mostBlog = (blogs) => {
    const authorArray = blogs.reduce((arr,blog) => {
        if(arr.some(a => a.author === blog.author)) {
            const index = arr.indexOf(arr.find(a => a.author === blog.author))
            arr[index].blog += 1
        }
        else {
            arr.push({
                author:blog.author,
                blog:1
            })
        }
        return arr
    },[])
    return authorArray.reduce((most,b)=>most.blog>b.blog?most:b)
}

const mostLikes = (blogs) => {
    const authorArray = blogs.reduce((arr,blog) => {
        if(arr.some(a => a.author === blog.author)) {
            const index = arr.indexOf(arr.find(a => a.author === blog.author))
            arr[index].likes += blog.likes
        }
        else {
            arr.push({
                author:blog.author,
                likes:blog.likes
            })
        }
        return arr
    },[])
    return authorArray.reduce((obj,item)=>obj.likes>item.likes?obj:item)
}

module.exports = {
    dummy,
    likeCounter,
    favoriteBlog,
    mostBlog,
    mostLikes
}