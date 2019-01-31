const Article = require('../models/Article');
const Edit = require('../models/Edit');

function createNewEdit(req, articleId) {
    return Edit.create({
        author: req.user._id,
        content: req.body.content,
        article: articleId,
        dateCreated: Date.now()
    })
}
module.exports = {
    getCreate: (req, res) => {
      res.render('article/create');
    },
    postCreate: (req, res) => {
        let article = req.body;
        Article.create({
            title: article.title,
            edits: []
        }).then(newArticle => {
            createNewEdit(req, newArticle._id).then(edit => {
                newArticle.edits.push(edit._id);
                Article.findByIdAndUpdate(newArticle._id, {edits: newArticle.edits})
                    .then(fullArticle => {
                        res.redirect('/article/all');
                    }).catch(err => {
                        article.globalError = err;
                        console.log(err);
                        res.render('article/create', article);
                    });
            }).catch(err => {
                article.globalError = err;
                console.log(err);
                res.render('article/create', article);
            });
        }).catch(err => {
            article.globalError = err;
            console.log(err);
            res.render('article/create', article);
        });
    },

    getAll: (req, res) => {
        Article.find({}).then(articles => {
            articles.sort((a,b) => a.title.localeCompare(b.title));
            res.render('article/all-articles', {articles})
        })
    },

    getDetails: (req, res) => {
        let articleId = req.params.id;
        Article.findById(articleId).then(article => {
            let lastEdit = article.edits.pop();
            Edit.findById(lastEdit).then(edit => {
                article.content = edit.content;
                res.render('article/article.hbs', article);
            });
        });
    },

    getEdit: (req, res) => {
        let articleId = req.params.id;
        Article.findById(articleId).then(article => {
            let lastEdit = article.edits.pop();
            Edit.findById(lastEdit).then(edit => {
                article.content = edit.content;
                if(req.isAuthenticated() && req.user.roles.indexOf('Admin') > -1) {
                    article.admin = true;
                }
                res.render('article/edit', article);
            });
        });
    },

    postEdit: (req, res) => {
        let editedArticle = req.body;
        createNewEdit(req,editedArticle._id)
        .then(edit => {
            Article.findById(editedArticle._id).then(article => {
                article.edits.push(edit._id);
                Article.findByIdAndUpdate(editedArticle._id, {edits: article.edits}).then(() => {
                        res.redirect('/article/details/'+editedArticle._id);
                    });
                }
            );
        }).catch(err => {
            editedArticle.globalError = err;
            console.log(err);
            res.redirect('/article/edit/' + editedArticle._id, editedArticle);
        });
    },

    articleHistory: (req, res) => {
        let articleId = req.params.id;
        Article.findById(articleId).populate({
            path: 'edits',
            populate: {path: 'author', select: 'email'}
        }).then(article => {
            res.render('article/history.hbs', article);
        });
    },

    editHistory: (req, res) => {
        let articleId = req.params.articleId;
        let editId = req.params.editId
        Article.findById(articleId).then(article => {
            Edit.findById(editId).then(edit => {
                article.content = edit.content;
                res.render('article/article.hbs', article);
            });
        });
    }
};