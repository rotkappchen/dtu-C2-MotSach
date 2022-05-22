const Books = require ('../models/book')

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

const bookCtrl = {
    getBooks: async(req, res) =>{
        try {
            const features = new APIfeatures(Books.find(), req.query)
            .filtering().sorting().paginating()
            const books = await features.query

            //res.json(books)

            res.json({
                status: 'success',
                result: books.length,
                books: books
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createBook: async (req, res)=>{
        try {
            const {book_id, title, description, summary, author, genre, language, images, page}= req.body;

            const book = await Books.findOne({book_id})
            if (book)
            return res.status(400).json({msg:"This book already exists."})

            const newBook= new Books({
                book_id, title: title.toLowerCase() , description, summary, author, genre, language, images, page
            })
            
            await newBook.save()
            res.json({msg:"New book added."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteBook: async (req, res)=>{
        try {
            await Books.findByIdAndDelete(req.params.id)
            res.json({msg:"Book deleted."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateBook: async (req, res)=>{
        try {
            const { title, description, summary, author, genre, language, images, page, isPromoted, isBestSeller, sellerUrl}= req.body;
            
            await Books.findByIdAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), description, summary, author, genre, language, images, page, isPromoted, isBestSeller, sellerUrl
            })
            
            res.json({msg:"Book updated."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    reviews: async(req, res) => {
        try {
            const {rating} = req.body

            if(rating && rating !== 0){
                const book = await Books.findById(req.params.id)
                if(!book) return res.status(400).json({msg: 'Book does not exist.'})

                let num = book.numReviews
                let rate = book.rating

                await Books.findOneAndUpdate({_id: req.params.id}, {
                    rating: rate + rating, numReviews: num + 1
                })

                res.json({msg: 'Update success'})

            }

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = bookCtrl