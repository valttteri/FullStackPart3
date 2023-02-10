const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('postdata', (req) => {
return req.method === "POST" ? JSON.stringify(req.body) : ' ';
});

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

let persons = [
  {
    id: 1,
    name: 'Erkki Esimerkki',
    number: '040-123-456'
  },
  {
    id: 2,
    name: 'Mikko Mäkinen',
    number: '050-987-654'
  },
  {
    id: 3,
    name: 'Ville Virtanen',
    number: '093-333-444'
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

let info =
`<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date()}</p>`

app.get('/api/info', (req, res) => {
  res.send(info)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  if (id) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
  
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  const intitialPersons = persons.map(person => person.name)
  //console.log(intitialPersons)
  //console.log(body.name)

  const person = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
  }

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name cannot be blank' 
    })
  }
  if (!body.number) {
    return res.status(400).json({ 
      error: 'number cannot be blank' 
    })
  }
  if (intitialPersons.includes(body.name)) {
    return res.status(400).json({ 
      error: 'name already exists' 
    })
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
