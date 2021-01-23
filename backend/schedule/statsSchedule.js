const schedule = require('node-schedule');

module.exports = app => {
    /* Cron expression a cada minuto,execute a função arrow */
    schedule.scheduleJob('* * * ? * *', async () => {
        const usersCount = await app.db('users').whereNull('deletedAt').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        /* Chama o objeto Stat */
        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {}, { sort: { 'createdAt': -1 } })

        /* Seta novos valores no objeto */
        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })

        /* Caso ele não seta nenhum dado nas estatística de user,categories ou articles ele será setado as primeiras estatísticas */
        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles

        if (changeUsers || changeCategories || changeArticles) {
            /* Salva o objeto Stat com os novos dados */
            stat.save().then(() => console.log("\x1b[44m", "[Stat] Estatísticas atualizadas!", "\x1b[0m"))
        }
    });
}