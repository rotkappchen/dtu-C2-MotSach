const Blogs = require ('../models/blog')
const Users = require ('../models/user')

// Filter, sorting and paginating

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
       const queryObj = {...this.queryString} //queryString = req.query

       const excludedFields = ['p', 'sort', 'limit']
       excludedFields.forEach(el => delete(queryObj[el]))
       
       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    // //    gte = greater than or equal
    // //    lte = lesser than or equal
    // //    lt = lesser than
    // //    gt = greater than
       this.query.find(JSON.parse(queryStr))
         
       return this;
    }
    
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating(){
        const p = this.queryString.p * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (p - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }

}

const blogCtrl = {
    getBlogs: async(req, res) =>{
        try {
            const features = new APIfeatures(Blogs.find(), req.query)
            .filtering().sorting().paginating()
            const blogs = await features.query

            //res.json(books)

            res.json({
                status: 'success',
                result:  blogs.length,
                blogs: blogs
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createBlog: async (req, res)=>{
        try {
            const {title, content, summary, author, author_name, images}= req.body;   
            const user = await Users.findOne({_id: author})
            //const name = user.name
            const wordCount = content.trim().split(/\s+/).length
            const newBlog= new Blogs({
                title: title.toLowerCase() , 
                content, 
                summary, 
                author, 
                author_name,
                images, 
                word: wordCount
            })

            
            await newBlog.save()
            res.json(newBlog)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteBlog: async (req, res)=>{
        try {
            await Blogs.findByIdAndDelete(req.params.id)
            res.json({msg:"Blog deleted."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateBlog: async (req, res)=>{
        try {
            const { title, content, summary, images}= req.body;
            const thisblog = await Blogs.findById(req.params.id)
            const wordCount = content.trim().split(/\s+/).length
            await Blogs.findByIdAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), content, summary, images, word: wordCount
            })
            
            res.json({msg:"Blog updated."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateBlogStatus: async (req, res) => {
        try {
            const {status} = req.body

            await Blogs.findOneAndUpdate({_id: req.params.id}, {
                status: 1
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    reviews: async(req, res) => {
        try {
            const {rating} = req.body

            if(rating && rating !== 0){
                const blog = await Blogs.findById(req.params.id)
                if(!blog) return res.status(400).json({msg: 'Blog does not exist.'})

                let num = blog.numReviews
                let rate = blog.rating

                await Blogs.findOneAndUpdate({_id: req.params.id}, {
                    rating: rate + rating, numReviews: num + 1
                })

                res.json({msg: 'Update success'})

            }

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }

}

module.exports = blogCtrl