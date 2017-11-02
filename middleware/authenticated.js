export default function({ store, redirect }) {
    console.log('-----------> store.getters[\'auth/isAuthenticated\']:', store.getters['auth/isAuthenticated']); //DEBUG
    //FIXME 'auth/isAuthenticated' is always false
    if (!store.getters['auth/isAuthenticated']) {
        return redirect('/login');
    }
}
