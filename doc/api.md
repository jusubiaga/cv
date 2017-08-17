# API Documentation

## Tasks

### Create Task
```shell
$ curl -v -s -X POST -H 'Content-Type: application/json' -d '{"description": "This is task 1"}' 'http://localhost:3000/api/v1/tasks' | python -m json.tool

{
    "__v": 0,
    "_id": "59931a0b4933797f5ae401b6",
    "description": "This is task 1"
}
```

### Get All Tasks
```shell
$ curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/tasks' | python -m json.tool

{
    "tasks": [
        {
            "__v": 0,
            "_id": "59930b2530367b7f2f8c817e",
            "description": "This is task 3"
        },
        {
            "__v": 0,
            "_id": "59931a0b4933797f5ae401b6",
            "description": "This is task 1"
        },
        {
            "__v": 0,
            "_id": "59931a644933797f5ae401b7",
            "description": "This is task 2"
        }
    ]
}
```

### Get Task by Id
```shell
$ curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/tasks/59931a0b4933797f5ae401b6' | python -m json.tool

{
    "__v": 0,
    "_id": "59931a0b4933797f5ae401b6",
    "description": "This is task 1"
}
```


## Exams

### Create Exam
```shell
curl -v -s -X POST -H 'Content-Type: application/json' -d '{"topic": "java", "tasks": ["59930b2530367b7f2f8c817e", "59931a0b4933797f5ae401b6", "59931a644933797f5ae401b7"] }' 'http://localhost:3000/api/v1/exams' | python -m json.tool
{
    "__v": 0,
    "_id": "5995dac2880251172f69fa7f",
    "tasks": [
        "59930b2530367b7f2f8c817e",
        "59931a0b4933797f5ae401b6",
        "59931a644933797f5ae401b7"
    ],
    "topic": "java"
}
```

### Get All Exams
```shell
$ curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/exams' | python -m json.tool

{
    "exams": [
        {
            "__v": 0,
            "_id": "5995dac2880251172f69fa7f",
            "tasks": [
                "59930b2530367b7f2f8c817e",
                "59931a0b4933797f5ae401b6",
                "59931a644933797f5ae401b7"
            ],
            "topic": "java"
        }
    ]
}
```

### Get Exam by Id
```shell
$ curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/exams/5995dac2880251172f69fa7f' | python -m json.tool

{
    "__v": 0,
    "_id": "5995dac2880251172f69fa7f",
    "tasks": [
        "59930b2530367b7f2f8c817e",
        "59931a0b4933797f5ae401b6",
        "59931a644933797f5ae401b7"
    ],
    "topic": "java"
}
```

## Tests

### Create Test
```shell
$ $ curl -v -s -X POST -H 'Content-Type: application/json' -d '{"candidateId": "1111", "examId": "5995dac2880251172f69fa7f", "allowedTime": 60}' 'http://localhost:3000/api/v1/tests' | python -m json.tool

{
    "__v": 0,
    "_id": "5995dd3d2959581806b78bad",
    "allowedTime": 60,
    "candidateId": "1111",
    "createdDate": "2017-08-17T18:15:25.443Z",
    "examId": "5995dac2880251172f69fa7f",
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
            "examId": "5995dd3d2959581806b78bad",
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
            "examId": "5995dd3d2959581806b78bad",
            "remainingTime": 120,
            "status": "CREATED"
        }
    ]
}
```

### Get Test by Id
```shell
$ curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/5995dd3d2959581806b78bad' | python -m json.tool

{
    "__v": 0,
    "_id": "5995dd3d2959581806b78bad",
    "allowedTime": 60,
    "candidateId": "1111",
    "createdDate": "2017-08-17T18:15:25.443Z",
    "examId": "5995dac2880251172f69fa7f",
    "remainingTime": 60,
    "status": "CREATED"
}
```

### Get Test Tasks
```shell
$ curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/5995dd3d2959581806b78bad/tasks' | python -m json.tool

{
    "tasks": [
        {
            "__v": 0,
            "_id": "59930b2530367b7f2f8c817e",
            "description": "This is task 3"
        },
        {
            "__v": 0,
            "_id": "59931a0b4933797f5ae401b6",
            "description": "This is task 1"
        },
        {
            "__v": 0,
            "_id": "59931a644933797f5ae401b7",
            "description": "This is task 2"
        }
    ]
}
```

### Send Test
```shell
$ curl -v -s -X POST -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/5995dd3d2959581806b78bad/send' | python -m json.tool

{
    "__v": 0,
    "_id": "598e302c90d494455e19d3a3",
    "allowedTime": 60,
    "candidateId": "1111",
    "createdDate": "2017-08-11T22:31:08.740Z",
    "examId": "5995dac2880251172f69fa7f",
    "remainingTime": 60,
    "sentDate": "2017-08-11T22:35:17.728Z",
    "status": "SENT"
}
```

### Start Test
```shell
$ curl -v -s -X POST -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/5995dd3d2959581806b78bad/start' | python -m json.tool

{
    "__v": 0,
    "_id": "598e302c90d494455e19d3a3",
    "allowedTime": 60,
    "candidateId": "1111",
    "createdDate": "2017-08-11T22:31:08.740Z",
    "examId": "5995dac2880251172f69fa7f",
    "remainingTime": 60,
    "sentDate": "2017-08-11T22:35:17.728Z",
    "startDate": "2017-08-11T22:36:42.681Z",
    "status": "RUNNING"
}
```

### Complete Test
```shell
$ curl -v -s -X POST -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/5995dd3d2959581806b78bad/complete' | python -m json.tool

{
    "__v": 0,
    "_id": "5991c2ba78ac565c2adceaa2",
    "allowedTime": 120,
    "candidateId": "1112",
    "createdDate": "2017-08-14T15:33:14.921Z",
    "examId": "5995dac2880251172f69fa7f",
    "finishedDate": "2017-08-14T15:34:27.472Z",
    "remainingTime": 0,
    "sentDate": "2017-08-14T15:33:31.364Z",
    "startedDate": "2017-08-14T15:33:40.251Z",
    "status": "COMPLETED"
}
```


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
