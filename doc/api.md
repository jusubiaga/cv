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