## API Documentation

### Create Test
```shell
curl -v -s -X POST -H 'Content-Type: application/json' -d '{"candidateId": "1111", "examId": "2222"}' 'http://localhost:3000/api/v1/tests' | python -m json.tool

{
     "__v": 0,
     "_id": "598ca597b2f3301a57b3b70f",
     "candidateId": "1111",
     "createdDate": "2017-08-10T18:27:35.507Z",
     "examId": "2222",
     "status": "CREATED"
}
```

### Get All Tests

```shell
curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests' | python -m json.tool
{
    "tests": [
        {
            "__v": 0,
            "_id": "598ca597b2f3301a57b3b70f",
            "candidateId": "1111",
            "createdDate": "2017-08-10T18:27:35.507Z",
            "examId": "2222",
            "status": "CREATED"
        },
        {
            "__v": 0,
            "_id": "598ca5feb2f3301a57b3b710",
            "candidateId": "1112",
            "createdDate": "2017-08-10T18:29:18.513Z",
            "examId": "2222",
            "status": "CREATED"
        }
    ]
}
```

### Get Test by Id

```shell
 curl -v -s -X GET -H 'Accept: application/json' 'http://localhost:3000/api/v1/tests/598c7e81f7bcd90250406fe1' | python -m json.tool
{
    "__v": 0,
    "_id": "598ca597b2f3301a57b3b70f",
    "candidateId": "1111",
    "createdDate": "2017-08-10T18:27:35.507Z",
    "examId": "2222",
    "status": "CREATED"
}
```
