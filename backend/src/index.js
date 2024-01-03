require('dotenv').config();
require('./database')

const app = require ('./server')
app.use('/api/create/alumno', require('./routes/alumnos.route'))


app.listen(app.get('port'),()=>{
    console.log('server conect')
})