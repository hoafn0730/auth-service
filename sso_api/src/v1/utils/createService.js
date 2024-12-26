const createService = (model) => {
    const methods = {
        get: async ({ page = 1, pageSize = 10, where, include = [], ...options }) => {
            try {
                const skip = (page - 1) * pageSize;
                const { count, rows } = await model.findAndCountAll({
                    where,
                    offset: skip,
                    limit: pageSize,
                    distinct: true,
                    include,
                    ...options,
                });

                return {
                    meta: {
                        page,
                        pageSize,
                        total: count,
                    },
                    data: rows,
                };
            } catch (error) {
                throw error;
            }
        },

        getOne: ({ where, include = [], order = [], ...options }) => {
            try {
                return model.findOne({
                    where: where,
                    include,
                    order,
                    ...options,
                });
            } catch (error) {
                throw error;
            }
        },

        store: async (data, where) => {
            try {
                const [instance, created] = await model.findOrCreate({
                    where: { ...data, ...where },
                    defaults: { ...data },
                });

                if (!created) {
                    return { message: 'Instance already exists!' };
                }

                return instance;
            } catch (error) {
                throw error;
            }
        },

        update: async (id, data) => {
            try {
                const updated = await model.update(
                    { ...data },
                    {
                        where: { id },
                    },
                );

                if (updated[0]) {
                    return model.findOne({ where: { id } });
                } else {
                    return { message: 'Update failed!' };
                }
            } catch (error) {
                throw error;
            }
        },

        destroy: (id) => {
            try {
                return model.destroy({
                    where: { id },
                });
            } catch (error) {
                throw error;
            }
        },
    };

    methods.extends = (customMethods) => {
        return {
            ...methods,
            ...customMethods,
        };
    };

    return methods;
};

module.exports = createService;
