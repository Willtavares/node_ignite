const {request} = require('express');
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

// Middlewares
function verifyExistsAccontCPF(request, response, next) {
  const {cpf} = request.header;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({error: 'Customer not found'});
  }

  request.customer = customer;

  return next();
}

app.post('/account', (request, response) => {
  const {cpf, name} = request.body;

  const customerAwreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAwreadyExists) {
    return response.status(400).json({error: 'Customer Already Exists!'});
  }

  customers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: [],
  });
  return response.status(201).send();
});

app.get('/statement/:cpf', verifyExistsAccontCPF, (request, response) => {
  const {customer} = request;
  return response.json(customer.statement);
});

app.post('/deposit', verifyExistsAccontCPF, (request, response) => {
  const {description, amount} = request.body;

  const {customer} = request;
  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit',
  };

  customer.statement.push(statementOperation);

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


/** Paramos no capitulo 4 video 7 - vamos para o 8 */