import ACTIONS from './index'

export const addToList = book => async dispatch =>{
    const list = localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];

    const duplicates = list.filter(listItem => listItem._id===book._id);

    if (duplicates.length===0){
        const bookToList = {
            ...book,
            count: 1
        }
    

    list.push(bookToList)
    localStorage.setItem('list', JSON.stringify(list))

    dispatch({
        type: ACTIONS.ADD_TO_LIST,
        payload: list
    })

    }
}

export const deleteFromList = book => async dispatch  =>{

    const list = localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];

    const updateList = list.filter(listItem => listItem._id !== book._id)

    localStorage.setItem('list', JSON.stringify(updateList))

    dispatch({
        type: ACTIONS.DELETE_FROM_LIST,
        payload: updateList
    })

}