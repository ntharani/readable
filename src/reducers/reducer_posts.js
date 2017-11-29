import _ from 'lodash';
import { 
  FETCH_POSTS, FETCH_POSTS_PENDING, FETCH_POSTS_FULFILLED, 
  FETCH_CATEGORY_POSTS, FETCH_CATEGORY_POSTS_PENDING, FETCH_CATEGORY_POSTS_FULFILLED,
  FETCH_POST_DETAIL, FETCH_POST_DETAIL_PENDING, FETCH_POST_DETAIL_FULFILLED, 
  VOTE_POST, VOTE_POST_PENDING, VOTE_POST_FULFILLED,
  ORDER_POSTS_BY,
  GET_CATEGORIES, GET_CATEGORIES_PENDING, GET_CATEGORIES_FULFILLED,
  CREATE_POST,
  EDIT_POST, 
  DELETE_POST } from '../actions';

const initialState = {
  orderBy : "voteScore"
}

export default function (state = initialState, action) {
  console.log("Reducer Action Received", action);
  
  switch(action.type){

    case GET_CATEGORIES: 
      return {...state, categories: action.payload.data["categories"]};

    case GET_CATEGORIES_FULFILLED: 
    return {...state, categories: action.payload.data["categories"]};

    case FETCH_POSTS: 
      return;

    case FETCH_POSTS_FULFILLED:       // _.mapKeys (Lodash) here to covert array to object.    
      const postData = _.mapKeys(action.payload.data, 'id');
      // console.log("FETCH_POSTS:R ", action.payload.data, postData, state); // Note: former is array, latter is object.
      return {...state, lists: {...state.lists, ...postData } };

    case FETCH_CATEGORY_POSTS: 
      // const postCategoryData = _.mapKeys(action.payload.data, 'id');
      // console.log("FETCH_CATEGORY_POSTS:R", action.payload.data, postCategoryData, state);      
      // return action.payload.data;      
      // return {...state, lists: postCategoryData }; // NB: Here we are overwriting the state with a new result set..
      return;

    case FETCH_CATEGORY_POSTS_FULFILLED: 
      const postCategoryData = _.mapKeys(action.payload.data, 'id');
      // console.log("FETCH_CATEGORY_POSTS:R", action.payload.data, postCategoryData, state);      
      // return action.payload.data;      
      return {...state, lists: postCategoryData }; // NB: Here we are overwriting the state with a new result set..

    case FETCH_POST_DETAIL_FULFILLED: 
      // NB: action.payload.data here returns an object, so we coerce it back into an array
      // What happens if multiple objects are returned? We'll need some logic here to check that
      const postDetailData = _.mapKeys([action.payload.data], 'id');    
      // console.log("FETCH_POST_DETAIL:R ", action.payload.data, postDetailData, state);
      // return postDetailData;
      return {...state, lists: {...state.lists, ...postDetailData }};

    case VOTE_POST_FULFILLED: 
      const postVoteData = _.mapKeys([action.payload.data], 'id');    
      // console.log("VOTE_POST:R ", action.payload.data, postVoteData, state);
      // return postVoteData;
      return {...state, lists: {...state.lists, ...postVoteData }};

    case ORDER_POSTS_BY: 
      return {...state, orderBy: action.payload};

    // case CREATE_POST: // Handled by ReduxForm, react-redux-form has a different philosophy here.
      // This will never be called because we put a callback on CreatePost action creator. Is that valid?
      // Is there a way or best pratice to link this reducer aspect to reduxForm createPost?
      // const createPostResult = _.mapKeys([action.payload.data], 'id');        
      // console.log("CREATE_POST:R - Handled by ReduxForm so no action.payload here ", action, state);
      // return {...state};     
      // return {...state, lists: {...state.lists, ...createPostResult}};

    case EDIT_POST:
      // console.log("EDIT Post Reducer state is, ", state, action.payload);
      return {...state, lists: {...state.lists, [action.payload.id]: action.payload}};

    case DELETE_POST:
      const newState = _.omit(state.lists, action.payload.id);
      // console.log("Delete Post Reducer: payload, state, newState, ", action.payload, state, newState);
      return {...state, lists: {...newState}};
      
    default: 
      return state;
  }
}