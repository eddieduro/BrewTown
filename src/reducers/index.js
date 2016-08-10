import {combineReducers} from 'redux';
import coords from './coordsReducer';

const rootReducer = combineReducers({
  coords
});

export default rootReducer;
