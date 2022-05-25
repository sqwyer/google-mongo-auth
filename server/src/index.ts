import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import { protect } from './middleware/protected';
import { config } from 'dotenv';
import { GoogleRouter } from './routes/google';

if(process.env.NODE_ENV != 'production') config();
const PORT = Number(process.env.PORT) || 3000;

require('./auth');

const app = express();

const cwd = process.cwd();

const pInit = passport.initialize.bind(passport);
const pSession = passport.session.bind(passport);

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(pInit());
app.use(pSession());
app.set('view engine', 'hbs');
app.set('views', `${cwd}/client/pages`);

app.use(GoogleRouter);

app.get('/', protect, (req, res) => {
    res.render('dashboard', {user: req.user});
});

app.post('/auth/logout', (req, res) => {
    req.logout(err => {
        if(err) res.redirect('/?err=Failed to log out.');
        else res.redirect('/auth/google');
    });
});

app.listen(PORT, () => {
    console.log('Running on PORT:' + PORT);
});