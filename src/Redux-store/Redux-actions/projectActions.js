export const createProject = (project) =>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        //async call
        dispatch({type:'CREATE_PROJECT',project});
    }
};