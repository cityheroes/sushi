## Attachers

- template: Se grega un valor fijo (objeto, string, array, etc)
- formulaTemplate: Se agrega un valor (objeto, string, array, etc) que será evaluado completamente (incluyendo los keys de los objetos) con FormulaValues.

Ejemplo:

Tenemos esta colección de datos:

```
[
    {
        "name": "A",
        "value": 3
    },
    {
        "name": "B",
        "value": 4
    },
    {
        "name": "C",
        "value": 2
    },
    {
        "name": "D",
        "value": 5
    }
]
```

Y este recipe:

```
[
    {
        "op": "attachers",
        "cont": [
            {
                "name": "formulaTemplate",
                "dest": "new_value",
                "context": {
                    "pi": 3.1456
                },
                "template": {
                    "run": "This is #{{$index}}",
                    "{{item.name}}-code": "=8*{{item.value}}*{{context.pi}}",
                    "by-two": "=2*{{item.value}}*{{context.pi}}",
                    "an_array": [
                        {
                            "result": "={{$index}}*{{item.value}}*{{context.pi}}"
                        },
                        "hey",
                        "{{item.name}}"
                    ]
                }
            }
        ]
    }
]
```

Tenemos este resultado:

```
[
    {
        "name": "A",
        "value": 3,
        "new_value": {
            "run": "This is #0",
            "by-two": 18.8736,
            "an_array": [
                {
                    "result": 0
                },
                "hey",
                "A"
            ],
            "A-code": 75.4944
        }
    },
    {
        "name": "B",
        "value": 4,
        "new_value": {
            "run": "This is #1",
            "by-two": 25.1648,
            "an_array": [
                {
                    "result": 12.5824
                },
                "hey",
                "B"
            ],
            "B-code": 100.6592
        }
    },
    {
        "name": "C",
        "value": 2,
        "new_value": {
            "run": "This is #2",
            "by-two": 12.5824,
            "an_array": [
                {
                    "result": 12.5824
                },
                "hey",
                "C"
            ],
            "C-code": 50.3296
        }
    },
    {
        "name": "D",
        "value": 5,
        "new_value": {
            "run": "This is #3",
            "by-two": 31.456,
            "an_array": [
                {
                    "result": 47.184
                },
                "hey",
                "D"
            ],
            "D-code": 125.824
        }
    }
]
```