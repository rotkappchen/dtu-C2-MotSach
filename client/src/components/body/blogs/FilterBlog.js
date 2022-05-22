import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState)

    const [sort, setSort] = state.blogsAPI.sort
    const [search, setSearch] = state.blogsAPI.search


    //console.log(genre)

    return (
        <div className="filter_menu">

            <input type="text" value={search} placeholder="Enter your search!"
            onChange={e => setSearch(e.target.value.toLowerCase())} />

            <div className="row sort">
                <span>Sort By: </span>
                <select value={sort} onChange={e => setSort(e.target.value)} >
                    <option value=''>Newest</option>
                    {/* <option value='sort=oldest'>Oldest</option> */}
                    <option value='sort=-word'>Word: High-Low</option>
                    <option value='sort=word'>Word: Low-High</option>
                    <option value='sort=author_name'>Writer</option>
                </select>
            </div>
        </div>
    )
}

export default Filters
