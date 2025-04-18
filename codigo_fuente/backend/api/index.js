const express = require('express');
const routerApi = require('./routes');
const cors = require('cors');

const { logErrors, errorHandler, boomErrorHandler, ORMErrorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json()) // Middleware para parsear el body de las peticiones a JSON. Si no se pone, no se puede acceder al body de la peticion

app.use(cors());

app.get('/api', (req, res) => {
  res.send('Se inicio el back');
})

routerApi(app);

// Aca abajo se setean los middleware de error. Se pueden crear tantos como se necesiten, pero siempre deben ir en el mismo orden que se ejecutan. El orden es importante, ya que si un middleware no llama a next(), no se ejecuta el siguiente middleware.
app.use(logErrors); // Segun el orden que se coloquen es el orden en el cual se ejecutan
app.use(ORMErrorHandler)
app.use(boomErrorHandler)
app.use(errorHandler); // Ya que el errorHandler NO usa next, si se pone primero no ejecutaria el siguiente middleware



if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`Página inicializada en el puerto ${port}`);
  });
}

module.exports = app; // Exportamos la aplicacion para ser utilizada en otros archivos. Si utilizamos vercel, este maneja la ruta automaticamente, no se utiliza app.listen()

