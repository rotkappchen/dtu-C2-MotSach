import ACTIONS from '../actions/'

let INITIAL_STATE ={
    list: []
}

if (localStorage.getItem('list')){
    INITIAL_STATE.cart=JSON.parse(localStorage.getItem('list'));

} else {
    INITIAL_STATE=[];
}

const listReducer = (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case ACTIONS.ADD_TO_LIST:
            return {
                list: [...action.payload]
            };
        case ACTIONS.DELETE_FROM_LIST:
            return {
                list: [...action.payload]
            };
            default: 
                return state;
    }
}

export default listReducer;

