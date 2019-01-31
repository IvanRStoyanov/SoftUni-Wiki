const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const articleController = require('../controllers/articleController');
const auth = require('./auth');
module.exports = (app) => {
    app.get('/', homeController.goHomeUser);
    app.get('/user/register', userController.getRegister);
    app.post('/user/register', userController.postRegister);
    app.post('/user/logout', userController.logout);
    app.get('/user/login', userController.getLogin);
    app.post('/user/login', userController.postLogin);
    app.get('/article/create', auth.isAuth, articleController.getCreate);
    app.post('/article/create', auth.isAuth, articleController.postCreate);
    app.get('/article/all', articleController.getAll);
    app.get('/article/details/:id', articleController.getDetails);
    app.get('/article/edit/:id', auth.isAuth, articleController.getEdit);
    app.post('/article/edit', auth.isAuth, articleController.postEdit);
    app.get('/article/history/:id', auth.isAuth, articleController.articleHistory);
    app.get('/edit/details/:articleId/:editId', auth.isAuth, articleController.editHistory);


    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end()
    });
};