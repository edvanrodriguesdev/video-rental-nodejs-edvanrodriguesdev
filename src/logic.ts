import { Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import format from 'pg-format';
import { client } from './database';
import { TMovies, TMoviesRequest } from './interfaces';

const createMovie = async (req: Request, res: Response): Promise<Response> => {

    const moviesData: TMoviesRequest = req.body

    const queryString: string = format(
        `
    INSERT INTO
        movies
        (%I)
    VALUES
        (%L)
    RETURNING *;
    `,
    Object.keys(moviesData),
    Object.values(moviesData)
    )

    const queryResult: QueryResult<TMovies> = await client.query(queryString)


    return res.status(201).json(queryResult.rows[0])
}

const listMovies = async (req: Request, res: Response): Promise<Response> => {

    const category: any = req.query.category
    let queryString: string = ''
    let queryResult: QueryResult

    if(category) {
        queryString = `
        SELECT
            *
        FROM
            movies
        WHERE
            category = $1;
        `

        const queryConfig: QueryConfig = {
            text: queryString,
            values: [category],
        }
        queryResult = await client.query(queryConfig)
        if(!queryResult.rows[0]){
            queryString = `
        SELECT
            *
        FROM
            movies;
        `
        queryResult = await client.query(queryString)
    }
        
    } else {
        queryString = `
        SELECT
            *
        FROM
            movies;
        `
        queryResult = await client.query(queryString) 
    }
        
    return res.json(queryResult.rows)
}

const retrieveMovie = async (req: Request, res: Response): Promise<Response> => {

    const movie: TMovies = res.locals.movie

    return res.json(movie)
}

const updateMovie = async (req: Request, res: Response): Promise<Response> => {

    const moviesData: Partial<TMovies> = req.body
    const id: number = parseInt(req.params.id)

    const queryString: string = format(
        `
        UPDATE
            movies
            SET(%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
        `,
        Object.keys(moviesData),
        Object.values(moviesData),
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: QueryResult<TMovies> = await client.query(queryConfig)

    return res.json(queryResult.rows[0])

}

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {

    const id: number = parseInt(req.params.id)

    const queryString: string = `
        DELETE
        FROM
            movies
        WHERE
            id = $1
        `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    await client.query(queryConfig)

    return res.status(204).send()
}


export { createMovie, listMovies, retrieveMovie, updateMovie, deleteMovie }