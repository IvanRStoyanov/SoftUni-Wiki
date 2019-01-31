const Article = require('../models/Article');
const Edit = require('../models/Edit');
module.exports = {
    goHomeUser: (req, res) => {
        Article.find({}).then(articles => {
            if(articles.length === 0){
                return res.render('home/index');
            }
            articles = articles.slice(-3).reverse();
            let lastArticle = articles[0];
            Edit.findById(lastArticle.edits.pop()).then(edit => {
                let shortView = edit.content.split(' ');
                let shortArr = [];
                for (let i = 0; i < 50; i++) {
                    shortArr.push(shortView[i]);
                }
                lastArticle.content = shortArr.join(' ') + '...';
                res.render('home/index.hbs', {articles, lastArticle});
            });
        })
    }
};