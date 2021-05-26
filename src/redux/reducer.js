const initialState = {
    username: '',
    profile_pic: ''
}

const UPDATE_USER = 'UPDATE_USER';
const LOGOUT_USER = 'LOGOUT';

export function updateUser(userObj) {
    return {
        type: UPDATE_USER,
        payload: userObj
    }
}

export function logoutUser() {
    return {
        type: LOGOUT_USER
    }
}


export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_USER:
            return { ...state, username: payload.username, profile_pic: payload.profile_pic }

        case LOGOUT_USER:
            return { ...state, username: '', profile_pic: '' }

        default:
            return state;
    }
}
