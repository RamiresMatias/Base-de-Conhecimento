module.exports = {
    categoryWithChildren: `
    WITH RECURSIVE subcategories (id) AS (
        SELECT id FROM categories WHERE id = ?
        UNION ALL
        SELECT c.id FROM subcategories, categories c
            WHERE "parentId" = subcategories.id
    )
    SELECT id FROM subcategories
    `
}
/* De forma recursa essa consulta trás as categorias e as categorias filha conforme o parentId de categories for igual a subcategories.id
subcategories é uma  tabela temporária para armazenar as categorias, logo ele pega a categoria pai e depois a categoria filha e depois a categoria
filha da filha e assim por diante */