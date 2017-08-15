## API Documentation

### Create Test
```shell
$ curl -v -s -X POST -H 'Content-Type: application/json' -d '{"candidateId": "1111", "examId": "2222", "allowedTime": 60}' 'http://localhost:3000/api/v1/tests' | python -m json.tool

{
    "__v": 0,
    "_id": "598e302c90d494455e19d3a3",
    "allowedTime": 60,
    "candidateId": "1111",
    "createdDate": "2017-08-11T22:31:08.740Z",
    "examId": "2222",
    "remainingTime": 60,
    "status": "CREATED"
}
```

### Get All Tests

```shell
$ curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests' | python -m json.tool

{
    "tests": [
        {
            "__v": 0,
            "_id": "598e302c90d494455e19d3a3",
            "allowedTime": 60,
            "candidateId": "1111",
            "createdDate": "2017-08-11T22:31:08.740Z",
            "examId": "2222",
            "remainingTime": 32,
            "sentDate": "2017-08-11T22:35:17.728Z",
            "startDate": "2017-08-11T22:36:42.681Z",
            "status": "RUNNING"
        },
        {
            "__v": 0,
            "_id": "598e307790d494455e19d3a4",
            "allowedTime": 120,
            "candidateId": "1112",
            "createdDate": "2017-08-11T22:32:23.430Z",
            "examId": "2223",
            "remainingTime": 120,
            "status": "CREATED"
        }
    ]
}
```

### Get Test by Id

```shell
$ curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/598e302c90d494455e19d3a3' | python -m json.tool

{
    "__v": 0,
    "_id": "598e302c90d494455e19d3a3",
    "allowedTime": 60,
    "candidateId": "1111",
    "createdDate": "2017-08-11T22:31:08.740Z",
    "examId": "2222",
    "remainingTime": 60,
    "status": "CREATED"
}
```

### Send Test
```shell
$ curl -v -s -X POST -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/598e302c90d494455e19d3a3/send' | python -m json.tool

{
    "__v": 0,
    "_id": "598e302c90d494455e19d3a3",
    "allowedTime": 60,
    "candidateId": "1111",
    "createdDate": "2017-08-11T22:31:08.740Z",
    "examId": "2222",
    "remainingTime": 60,
    "sentDate": "2017-08-11T22:35:17.728Z",
    "status": "SENT"
}
```

### Start Test
```shell
$ curl -v -s -X POST -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/598e302c90d494455e19d3a3/start' | python -m json.tool

{
    "__v": 0,
    "_id": "598e302c90d494455e19d3a3",
    "allowedTime": 60,
    "candidateId": "1111",
    "createdDate": "2017-08-11T22:31:08.740Z",
    "examId": "2222",
    "remainingTime": 60,
    "sentDate": "2017-08-11T22:35:17.728Z",
    "startDate": "2017-08-11T22:36:42.681Z",
    "status": "RUNNING"
}
```

### Complete Test
```shell
$ curl -v -s -X POST -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/5991c2ba78ac565c2adceaa2/complete' | python -m json.tool

{
    "__v": 0,
    "_id": "5991c2ba78ac565c2adceaa2",
    "allowedTime": 120,
    "candidateId": "1112",
    "createdDate": "2017-08-14T15:33:14.921Z",
    "examId": "2223",
    "finishedDate": "2017-08-14T15:34:27.472Z",
    "remainingTime": 0,
    "sentDate": "2017-08-14T15:33:31.364Z",
    "startedDate": "2017-08-14T15:33:40.251Z",
    "status": "COMPLETED"
}
```

### Get Test Tasks
Para presentarle el test al candidato.
Separado para autorizar
GET /tests/:id/tasks
uscar tests con id, obtener exam_id, buscar exam con id
Del exam obtener lista de tasks

### Submit Test Responses
Para que el candidato submitee sus respuestas
Se puede utlizar para submitir automaticamente cada cierto tiempo
POST /tests/:id/responses body: list of task responses c/u con task id
buscar test con id, obtener test_resp_id, si no existe crear, actualizar responses

### Get Test Responses
Para corregir
Deberiamos incluir las respuestas asociadas a cada task?
GET /tests/:id/responses
buscar test con id, obtener test_resp_id, buscar test response con id

### Get Test Solutions
Para corregir
GET /tests/:id/solutions
Buscar tests con id, obtener exam_id, buscar exam con id
Del exam, obtener lista de tasks
(buscar tasks con esos id y traer solo task_sol_id
Para cada task buscar task solution.
