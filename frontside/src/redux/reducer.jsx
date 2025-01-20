import {combineReducers} from '@reduxjs/toolkit'

import auth from './slices/auth.jsx'
import appdata from './slices/appdata.jsx'
// import {persistReducer} from "redux-persist"
// import storage from "redux-persist/lib/storage"
// const persistConfig = {
//     key: "root",
//     version : 1,
//     storage
// }

const rootReducer = combineReducers({
    auth:auth,
    appdata:appdata
})
// const persistedReducer = persistReducer(persistConfig,rootReducer)

export default rootReducer