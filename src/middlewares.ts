import  { Request, Response, NextFunction, request } from 'express'
import { QueryConfig, QueryResult } from 'pg'
import { client } from './database'
import { TMovies } from './interfaces'


const ensureMovieExistsMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    const id: number = parseInt(req.params.id)

    const queryString: string = `
    SELECT
        *
    FROM
        movies
    WHERE
        id = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    }

    const queryResult: QueryResult<TMovies> = await client.query(queryConfig)

    if(queryResult.rowCount === 0){
        return res.status(404).json({
            error: 'Movie not found!'
        })
    }

    res.locals.movie = queryResult.rows[0]

    return next()

}

const verifyNameExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    const name: string = req.body.name

    const queryString: string = `
    SELECT
        *
    FROM
        movies
    WHERE
        name = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [name]
    }

    const queryResult: QueryResult<TMovies> = await client.query(queryConfig)

    if(queryResult.rows[0]){
        return res.status(409).json({
            error: 'Movie name already exists!'
        })
    }

    return next()

}


export { ensureMovieExistsMiddleware, verifyNameExists }