import React from 'react'
import {applyMiddleware, compose, createStore} from 'redux'
import rootReducer from './reducers/'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const middleware =[thunk]

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ,composeWithDevTools(applyMiddleware(...middleware))
)

function DataProvider0({children}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default DataProvider0
