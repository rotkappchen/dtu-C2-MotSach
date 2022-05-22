const Genre = require ('../models/genre')

const genreCtrl = {
    getGenres: async (req, res)=>{
        try {
            const genres = await Genre.find()
            res.json(genres)
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }   
    },
    createGenre: async (req, res) =>{
        try {
            const {title} = req.body;
            const genre = await Genre.findOne({title})
            if(genre) return res.status(400).json({msg: "This genre already exists."})

            const newGenre = new Genre({title})

            await newGenre.save()
            res.json('Created a genre.')
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    deleteGenre: async (req, res) => {
        try {
            await Genre.findByIdAndDelete(req.params.id)
            res.json({msg: "Genre deleted."})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateGenre: async (req, res) => {
        try {
            const {title}= req.body
            await Genre.findByIdAndUpdate({_id: req.params.id}, {title})
            
            res.json("Genre updated.")
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = genreCtrl