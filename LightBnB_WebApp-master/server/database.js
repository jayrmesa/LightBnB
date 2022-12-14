const properties = require('./json/properties.json');

//////////////////////////////////////////////////////////////////////
/// Database adapter for PostgreSQL pool
//////////////////////////////////////////////////////////////////////

const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb',
});

//////////////////////////////////////////////////////////////////////
/// WHERE, AND clause - Properties
//////////////////////////////////////////////////////////////////////

/**
 * Returns  WHERE or AND depending if its first time called.
 * @return {String} 'WHERE || 'AND' for use on SQL queries.
 */

  const whereAndClause = () => {
    const param = ['WHERE', 'AND'];

    return function() {
      return param.length > 1 ? param.shift() : param[0];
    }
  };


//////////////////////////////////////////////////////////////////////
/// Users
//////////////////////////////////////////////////////////////////////

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool
  .query(`SELECT * FROM users WHERE email = $1;`, [email])
  .then(res => {
    return res.rows[0] || null;
  })
  .catch(err => {
    console.log('Oh no there seems to be an error:', err.message);
  });
};
exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(`SELECT * FROM users WHERE id = $1;`, [id])
  .then(res => {
    return res.rows[0] || null;
  })
  .catch(err => {
    console.log('Oh no there seems to be an error:', err.message);
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
  .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, 
  [user.name, user.email, user.password])
  .then(res => {
    return res;
  })
  .catch(err => {
    console.log('Oh no there seems to be an error:', err.message);
  });
}
exports.addUser = addUser;


//////////////////////////////////////////////////////////////////////
/// Reservations
//////////////////////////////////////////////////////////////////////

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT reservations.*, properties.*, AVG(coalesce(rating, 0)) as average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2`;

  console.log(queryString, [guest_id, limit]);

  return pool
    .query(queryString, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Oh no there seems to be an error:', err.message);
    });
}
exports.getAllReservations = getAllReservations;


//////////////////////////////////////////////////////////////////////
/// Properties
//////////////////////////////////////////////////////////////////////

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
    const WHERE_AND = whereAndClause();

    /// Basic query implementation that comes before the WHERE clause
    let queryString = `
    SELECT properties.*, avg(rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id`;

    /// Additional options query, check the city has been passed
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `\n\t${WHERE_AND()} city LIKE $${queryParams.length}`;
    }

    /// owner_id is passed, only return properties belonging to that owner.
    if (options.owner_id) {
      queryParams.push(`${options.owner_id}`);
      queryString += `\n\t${WHERE_AND()} owner_id = $${queryParams.length}`;
    }

    /// minimum price per night multiplied by 100 since the data stores in cents.
    if (options.minimum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night * 100}`);
      queryString += `\n\t${WHERE_AND()} cost_per_night >= $${queryParams.length}`;
    }

    /// maximum price per night multiplied by 100 since the data stores in cents.
    if (options.maximum_price_per_night) {
      queryParams.push(`${options.maximum_price_per_night * 100}`);
      queryString += `\n\t${WHERE_AND()} cost_per_night <= $${queryParams.length}`;
    }

    queryString += `
    GROUP BY properties.id`;

    /// Another optional query, If a minimum_rating is passed, only return properties with a rating equal to or higher.
    if (options.minimum_rating) {
      queryParams.push(`${options.minimum_rating}`);
      queryString += `\n  HAVING avg(rating) >= $${queryParams.length}`;
    }

    /// Ending query, set the limit for the number of results to be returned
    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length}`;

    /// just to make sure it works
    console.log(queryString, queryParams);

    //Submit
    return pool.query(queryString, queryParams).then((res) => res.rows);
  };

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  )
  VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`;

  const queryParams = [
    property.owner_id, 
    property.title, 
    property.description, 
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  return pool
    .query(queryString, queryParams)
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log('Oh no there seems to be an error:', err.message);
    });
};
exports.addProperty = addProperty;
