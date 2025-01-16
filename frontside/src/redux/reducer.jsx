import {combineReducers} from '@reduxjs/toolkit'

import auth from './slices/auth.jsx'
import appdata from './slices/appdata.jsx'

const rootReducer = combineReducers({
    auth:auth,
    appdata:appdata
})

export default rootReducer