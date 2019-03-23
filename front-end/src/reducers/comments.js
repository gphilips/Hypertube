import { STORE_COMMENTS, CLEAR_COMMENTS, COMMENT_ADDED, COMMENT_REMOVED } from "../constants/comments";
  
  const initialState = {
    comments: [],
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case STORE_COMMENTS:
        return {
          ...state,
          comments: action.payload,
        };
      case CLEAR_COMMENTS:
        return {
          ...state,
          comments: []
        };
      case COMMENT_ADDED:
        return {
          ...state,
          comments: state.comments.concat(action.payload),
        };
      case COMMENT_REMOVED:
        return {
          ...state,
          comments: state.comments.filter(comment => comment._id !== action.payload),
        };
      default:
        return state;
    }
  };
  