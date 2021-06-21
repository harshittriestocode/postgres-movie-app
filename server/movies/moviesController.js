const moment = require('moment');
const { isEmpty } = require("lodash");
const { Op } = require("sequelize");
const { Movie } = require('../../model');

const createNewMovie = async (req, res) => {
    const { title, year, length, actors } = req.body;

    const movieId = `MV-${moment().unix()}`;
    const movieRecord = {
        movieId,
        title,
        year,
        length,
        actors
    }

    const result = await Movie.create(movieRecord);
    console.log(result.toJSON());

    if (!isEmpty(result)) {
        res.send(result);
    } else {
        res.send({ error: "Movie creations Failed" });
    }
}

const listMovies = async (req, res) => {
    const movies = await Movie.findAll();

    const formattedMovies = movies.map(r => r.get({plain: true}));

    if(!isEmpty(formattedMovies)) {
        res.send(formattedMovies);
    } else {
        res.send({error: "No movies found!"});
    }
};

const searchMovieTitle = async (req, res) => {
    const {title} = req.params;

    const searchResult = await Movie.findAll({
        where: {
            title: {
                [Op.like] : `%${title}%`,
            }
        },
        raw: true
    });

    console.log(searchResult);

    if (isEmpty(searchResult)) {
        res.send({ message: 'No Records Found' });
    } else {
        res.send(searchResult);
    }
};

const updateMovie = async (req, res) => {
    const { movieId } = req.params;
    const data = req.body;
    const result = await Movie.update(data, {
        where: {
            movieId: movieId
        }
    });
    if (result) {
        return res.json({ message: "Movie updated successfully" });
    }
    else {
        return res.json({ message: "Cannot update." });
    }

};

// delete the record with movie id
const deleteMovie = async (req, res) => {
    const { movieId } = req.params;
    const result = await Movie.destroy({
        where: {
            movieId: movieId
        }
    });
    if (result) {
        return res.json({ message: "Movie deleted successfully" });
    }
    else {
        return res.json({ message: "Cannot delete" });
    }

};

module.exports = {
    createNewMovie,
    listMovies,
    searchMovieTitle,
    updateMovie,
    deleteMovie
};