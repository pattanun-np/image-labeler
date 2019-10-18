
const projectReduncer = (state = [], action) => {
    switch (action.type) {
        case 'CREATE_PROJECT':
            console.log('create project', action.project)
    }
    return state
}
export default projectReduncer; 