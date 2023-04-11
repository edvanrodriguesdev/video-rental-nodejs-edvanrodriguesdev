import express, { Application } from 'express'
import { startDatabase } from './database'
import { createMovie, deleteMovie, listMovies, retrieveMovie, updateMovie } from './logic'
import { ensureMovieExistsMiddleware, verifyNameExists } from './middlewares'


const app: Application = express()
app.use(express.json())

app.post('/movies', verifyNameExists, createMovie)
app.get('/movies', listMovies)
app.get('/movies/:id', ensureMovieExistsMiddleware, retrieveMovie)
app.patch('/movies/:id', ensureMovieExistsMiddleware, verifyNameExists, updateMovie)
app.delete('/movies/:id', ensureMovieExistsMiddleware, deleteMovie)


app.listen(3000, async () => {
    console.log('Server is running!')
    await startDatabase()
})