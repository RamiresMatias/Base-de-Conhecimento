module.exports = app => {
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    const get = (req, res) => {

        Stat.findOne({}, {}, { sort: { 'createdAt': -1 } })
            .then(stat => {
                const defaultStat = {
                    users: 0,
                    categories: 0,
                    articles: 0,
                }
                /* Caso ele não ache nenhuma estatística,ele retorna tudo zerado */

                res.json(stat || defaultStat)
            })

    }

    return { Stat, get }
}