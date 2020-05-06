const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const bcryptService = require('../services/bcrypt.service');
const auth = require('../services/auth.service');

const sequelize = require('../../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    fullName: {
      type: Sequelize.STRING,
    },
    userEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    userType: {
      type: Sequelize.ENUM,
      values: ['NORMAL', 'SUBSCRIBER', 'DISPUTED'],
    },
    avatar: {
      type: Sequelize.STRING,
    },
    website: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    zip: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    salt: {
      type: Sequelize.STRING,
    },
    authToken: {
      type: Sequelize.STRING,
    },
    facebook: {
      type: Sequelize.STRING,
    },
    facebookId: {
      type: Sequelize.STRING,
    },
    linkedin: {
      type: Sequelize.STRING,
    },
    twitter: {
      type: Sequelize.STRING,
    },
    twitterId: {
      type: Sequelize.STRING,
    },
    instagram: {
      type: Sequelize.STRING,
    },
    googleId: {
      type: Sequelize.STRING,
    },
    googleplus: {
      type: Sequelize.STRING,
    },
    passwordResetToken: {
      type: Sequelize.STRING,
    },
    passwordResetTokenExpiresAt: {
      type: Sequelize.STRING,
    },
    emailStatus: {
      type: Sequelize.ENUM,
      values: ['unconfirmed', 'confirmed'],
    },
    emailProofToken: {
      type: Sequelize.STRING,
    },
    emailProofTokenExpiresAt: {
      type: Sequelize.STRING,
    },
    shared: {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    },
    emailPreferenceSet: {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    },
    organization: {
      type: Sequelize.STRING,
    },
    createdTime: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedTime: {
      allowNull: false,
      type: 'TIMESTAMP',
    },
  },
  {
    freezeTableName: true,
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdTime',
    updatedAt: 'updatedTime',
    instanceMethods: {},
    hooks: {
      beforeCreate(user) {
        user.salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, this.salt);
        user.userType = 'NORMAL';
      },
    },
    scopes: {},
    connection: 'default',
  }
);

User.getByEmail = async (userEmail) => {
  return User.findOne({
    where: {
      userEmail,
    },
  }).then((userDetails) => {
    return userDetails;
  });
};

// eslint-disable-next-line
User.prototype.toJSON = () => {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

User.prototype.generateJwt = (user) => {
  console.log(user);
  const payload = {
    id: user.id,
    fullName: user.fullName,
    userEmail: user.userEmail,
    userType: user.userType,
  };

  const token = auth().issue(payload);
  return token;
};

User.addHook('afterCreate', (user) => {
  const authToken = user.generateJwt(user);

  return user.update(
    {
      authToken,
    },
    {
      where: {
        id: user.id,
      },
    }
  );
});

module.exports = User;
