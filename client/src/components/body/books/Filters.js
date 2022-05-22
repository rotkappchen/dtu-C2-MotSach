import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState)
    const [genres] = state.genresAPI.genres

    const [genre, setGenre] = state.booksAPI.genre
    const [sort, setSort] = state.booksAPI.sort
    const [search, setSearch] = state.booksAPI.search


    const handleGenre = e => {
        //console.log(e.target.value)
        setGenre(e.target.value)
        setSearch('')
    }

    //console.log(genre)

    return (
        <div className="filter_menu">
            <div className="row">
                <span>Filters: </span>
                <select name="category" value={genre} onChange={handleGenre} >
                    <option value=''>All Genres</option>
                    {
                        genres.map(genre => (
                            <option value={"genre=" + genre.title} key={genre._id}>
                                {genre.title}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" value={search} placeholder="Enter your search!"
            onChange={e => setSearch(e.target.value.toLowerCase())} />

            <div className="row sort">
                <span>Sort By: </span>
                <select value={sort} onChange={e => setSort(e.target.value)} >
                    <option value=''>Newest</option>
                    {/* <option value='sort=oldest'>Oldest</option> */}
                    <option value='sort=-rating'>Rating: High-Low</option>
                    <option value='sort=rating'>Rating: Low-High</option>
                </select>
            </div>
        </div>
    )
}

export default Filters
