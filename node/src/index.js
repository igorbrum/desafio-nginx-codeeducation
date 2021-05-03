const express = require('express');
const mysql = require('mysql');
const { promisify } = require('util');

const app = express();
const port = 3000;

const config = {
  host: 'mysql',
  user: 'root',
  password: 'root'
};

const conn = mysql.createConnection(config);

const query = promisify(conn.query).bind(conn);

async function Init() {
  
  await query('CREATE DATABASE IF NOT EXISTS nodedb');
  await query('use nodedb');

  const rows = await query(`SHOW TABLES LIKE 'people'`);

  if (rows.length == 0) {
    await query('CREATE TABLE people (id int not null auto_increment, name varchar(255), primary key(id))');      
  }

  await query(`INSERT INTO people (name) VALUES ('Igor Brum')`);
}

Init();

app.get('/', async (req, res) => {
  let html = '<h1>Full Cycle Rocks!</h1>'
  
  const rows = await query('SELECT * FROM people');

  html += `<table style='width=100'>`
  html += `<tr>`
  html += `<th> ID </th>`
  html += `<th> Nome </th>`
  html += `</tr>`

  rows.forEach(function(data) {
    html += '<tr>'
    html += '<td>' + data.id + '</td>'
    html += '<td>' + data.name + '</td>'
    html += '</tr>'
  });

  html += '</table>'

  return res.send(html);  
})

app.listen(port, () => {
  console.log('Servidor Rodando na porta ' + port)
})