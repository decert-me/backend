const logger = require('../utils/logger');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  pool: { min: 0, max: 10 }
});

async function get(table, where = {}, options = {}) {
  let records = [];
  try {
    records = await knex(table).where(where);
  } catch (err) {
    logger.error('db get failed', { table, where }, err);
  }
  return records;
}

async function getOne(table, where = {}, options = {}) {
  let record = null;
  try {
    let records = await knex(table).where(where);
    record = records[0];
  } catch (err) {
    logger.error('db getOne failed', { table, where }, err);
  }
  return record;
}

async function add(table, data) {
  let id;
  try {
    let result = await knex(table).insert(data).returning('id');
    id = result[0].id;
  } catch (err) {
    logger.error('db add failed', { table, data }, err);
  }
  return id;
}

async function batchAdd(table, datas) {
  let num = 0;
  try {
    let result = await knex(table).insert(datas).returning('id');
    num = result.length;
  } catch (err) {
    logger.error('db batchAdd failed', { table, datas }, err);
  }
  return num;
}

async function update(table, where, data) {
  let ids;
  try {
    let result = await knex(table).where(where).update(data, ['id']);
    ids = result.map(ele => ele.id);
  } catch (err) {
    logger.error('db update failed', { table, where, data }, err);
  }
  return ids;
}

// --- Users
const findUserByAddress = async (address) => {
  let reslut = await knex('users').where('address', address).select();

  if (reslut.length === 0) {
    return { exists: false };
  }

  let user = reslut[0];
  user.id = user.address;
  user.creationTimestamp = Number(user.creationTimestamp);

  return { exists: true, data: { 'id': address, ...reslut[0] } };
};


// --- Quest
const createQuest = async (quest) => {
  let questData = {};
  try {
    let result = await knex.insert(quest, ['id']).into('quest');
    let id = result[0].id;
    questData = { id, ...quest };
  } catch (err) {
    console.error('createQuest failed', { quest }, err);
  }
  return questData;
};

const findQuests = async (where = {}) => {
  let keys = Object.keys(where);

  if (keys.length > 0) {
    let obj = {};
    for (let key of keys) {
      let k = `quest.${key}`;
      let v = where[key];
      obj[k] = v;
    }
    where = obj;
  }

  let reslut = await knex.select('quest.*', 'users.id as creatorId', 'users.address as creatorAddress')
    .from('quest')
    .leftJoin('users', 'quest.creator', '=', 'users.address')
    .where(where)
    .orderBy('id', 'desc')

  reslut.forEach(ele => {
    // ele.id = String(ele.id);
    ele.submittedTimestamp = Number(ele.submittedTimestamp);
  });
  return reslut;
};

const publishQuest = async (id) => {
  let reslut = await knex('quest').where('id', id).update({ 'isDraft': false });
};

const removeQuest = async (id) => {
  let reslut = await knex('quest').where('id', id).del();
};

const findQuestByName = async (name) => {
  let reslut = await knex('quest').where('name', name).select();
  return reslut[0];
};

const findQuestById = async (id) => {
  let reslut = await knex.select('quest.*', 'users.id as creatorId', 'users.address as creatorAddress')
    .from('quest')
    .leftJoin('users', 'quest.creator', '=', 'users.address')
    .where('quest.id', id);

  return reslut[0];
};

async function clearDb() {
  // test only
  if (process.env.NODE_ENV !== 'test') return;

  await knex('users').del();
  await knex('events').del();
  await knex('quest').del();
  await knex('user_challenges').del();
  await knex('transaction').del();
}

module.exports = {
  knex,
  get,
  getOne,
  add,
  batchAdd,
  update,
  clearDb,

  findUserByAddress,

  createQuest,
  findQuests,
  publishQuest,
  removeQuest,
  findQuestByName,
  findQuestById,
};
