const knex = require('knex')(require('./knexfile'))
const crypto = require('crypto');

function randomString() {
    return crypto.randomBytes(4).toString('hex')
}

function saltHashPassword(password, salt = randomString()) {
    const hash = crypto
        .createHmac('sha512', salt)
        .update(password);

    return {
        salt,
        hash: hash.digest('hex')
    }
}

module.exports = {
    saltHashPassword,
    createUser ({ username, password }) {
        console.log(`Creating user ${username}`)

        const { salt, hash } = saltHashPassword(password)

        return knex('user').insert({
            salt,
            encrypted_password: hash,
            username,
        })
    },
    authenticate({ username, password }) {
        return knex('user')
            .where({ username })
            .then(([user]) => {
                if(!user) {
                    return { success: false }
                }

                const { hash } = saltHashPassword(
                    password,
                    user.salt
                )

                return {
                    success: hash === user.encrypted_password
                }
            })
    }
}