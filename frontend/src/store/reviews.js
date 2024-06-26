import { csrfFetch } from "./csrf";


const LOAD_REVIEWS = "REVIEWS/load_reviews";
const SUBMIT_REVIEW = "REVIEWS/submit_review";
const UPDATE_REVIEW = "REVIEWS/update_review";
const REMOVE_REVIEW = "REVIEWS/remove_review;";

export const loadReviews = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    reviews
  }
};

export const loadNewReview = (review) => {
  return {
    type: SUBMIT_REVIEW,
    review
  }
};

export const loadUpdatedReview = (reviewId) => {
  return {
    type: UPDATE_REVIEW,
    payload: reviewId
  }
};

export const removeReview = (reviewId) => {
  return {
    type: REMOVE_REVIEW,
    payload: reviewId
  }
};

export const getSpotReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`, {
    method: "GET"
  });

  if (res.ok) {
    const reviews = await res.json();
    dispatch(loadReviews(reviews));
    return reviews;

  } else {
    const error = await res.json();
    console.error(error)
  }
};

export const getAllReviews = () => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews/current`, {
      method: "GET"
    });

    if (res.ok) {
      const reviews = await res.json();
      dispatch(loadReviews(reviews));
    } else {
      const error = await res.json();
      console.error(error)
    }

  } catch (err) {
    console.error(err)
    return err;
  }
};

export const submitReview = (spotId, review) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(review)
  });

  if (res.ok) {
    const review = await res.json();
    dispatch(loadNewReview(review));
    dispatch(getSpotReviews(spotId));
    return review;

  } else {
    const error = await res.json();
    console.error(error);
  }
};

export const updateReview = (reviewId, review) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(review)
    });

    if (res.ok) {
      const review = await res.json();
      dispatch(loadUpdatedReview(review));
    } else {
      const error = await res.json();
      console.error(error);
    }

  } catch (err) {
    console.error(err)
    return err;
  }
}

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE"
    });

    if (res.ok) {
      dispatch(removeReview(reviewId));
    } else {
      const error = await res.json();
      console.error(error);
    }

  } catch (err) {
    console.error(err)
    return err;
  }
};

let initialState = {};

export const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {

    case LOAD_REVIEWS: {
      const reviewsState = { ...state };
      action.reviews.Reviews
        .forEach(review => {
          reviewsState[review.id] = review;
        });
      return reviewsState;
    }

    case SUBMIT_REVIEW: {
      const submitReviewState = { ...state };
      submitReviewState[action.review.id] = action.review;
      return submitReviewState;
    }

    case UPDATE_REVIEW: {
      const updateReviewState = { ...state };
      updateReviewState[action.review.id] = action.review;
      return updateReviewState
    }

    case REMOVE_REVIEW: {
      const removeReviewState = { ...state };
      delete removeReviewState[action.payload];
      return removeReviewState;
    }

    default:
      return state;
  }
};
