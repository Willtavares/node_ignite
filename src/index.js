const {request} = require('express');
const {response} = require('express');
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
function verifyExistsAccountCPF(request, response, next) {
  const {cpf} = request.header;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({error: 'Customer not found'});
  }

  request.customer = customer;

  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type == 'credit') {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
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

app.get('/statement/:cpf', verifyExistsAccountCPF, (request, response) => {
  const {customer} = request;
  return response.json(customer.statement);
});

app.post('/deposit', verifyExistsAccountCPF, (request, response) => {
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

app.post('/withdraw', verifyExistsAccountCPF, (request, response) => {
  const {amount} = request.body;
  const {customer} = request;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({error: 'Insufficient Funds'});
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

app.get('/statement/date', verifyExistsAccountCPF, (request, response) => {
  const {customer} = request;
  const {date} = request.query;

  const dateFormat = new Date(date + ' 00:00');
  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return response.json(statement);
});

//Indicando qual porta eu desejo usar para inicializar o projeto.
// Neste caso foi usada a porta 3333
app.listen(3333);
