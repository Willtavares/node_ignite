const express = require('express');
const {v4: uuidV4} = require('uuid');

const app = express();
app.use(express.json());

const customers = [];

/**
 * Tipos de parametros *
 * Route Params => Identificar um recurso para editar/deletar/buscar
 * Query Params => Usados para paginação/filtro
 * Body Params => Usados para passar objetos de inserção/alteração (json)
 */

/** Para cadastrar a conta:
 * cpf - string
 * name - string
 * id - UUID
 * statement - []
 */

app.get('/courses', (request, response) => {
  const query = request.query;
  console.log(query);
  return response.json(['Curso 1', 'Curso 2', 'Curso 3', 'Curso 4']);
});

app.post('/account', (request, response) => {
  const {cpf, name} = request.body;

  const customerAwreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAwreadyExists) {
    return response.status(400).json({error: "Customer Already Exists!"})
  }

  customers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: [],
  });
  return response.status(201).send();
});

// app.put('/courses/:id', (request, response) => {
//   const params = request.params;
//   console.log(params);
//   return response.json(['Curso 6', 'Curso 2', 'Curso 3', 'Curso 4', 'Curso 5']);
// });

// app.path('/courses/id', (request, response) => {
//   return response.json(['Curso 6', 'Curso 9', 'Curso 3', 'Curso 4', 'Curso 5']);
// });

// app.delete('/courses/:id', (request, response) => {
//   return response.json(['Curso 6', 'Curso 3', 'Curso 4', 'Curso 5']);
// });

//Indicando qual porta eu desejo usar para inicializar o projeto.
// Neste caso foi usada a porta 3333
app.listen(3333);
