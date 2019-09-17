## Replace

- **keyMatch**: Un valor o expresión regular para seleccionar una llave para quitar del item (la comparación de tipo se aplica)
- **valueMatch**: Un valor o expresión regular para seleccionar una llave para quitar del item en base al **valor** (la comparación de tipo se aplica)

Entonces, si tenemos esta colección:

```
[
    {
        "name": "A",
        "count": 3,
        "details": {
            "detail_A": 39,
            "detail_B": "Don't remove me",
            "detail_C": "I will survive",
            "detail_D": "4055 help"
        }
    },
    {
        "name": "B",
        "count": 4,
        "details": {
            "detail_A": 49,
            "detail_B": "Remove me",
            "detail_C": 15.4445,
            "detail_D": "334"
        }
    },
    {
        "name": "C",
        "count": 2,
        "details": {
            "detail_A": 37,
            "detail_B": "Remove me",
            "detail_C": "I will struggle",
            "detail_D": "3455 help"
        }
    },
    {
        "name": "D",
        "count": 5,
        "details": {
            "detail_A": null,
            "detail_B": "Don't remove me",
            "detail_C": "I will survive",
            "detail_D": "23"
        }
    }
]
```

Con esta receta:

```
[
    {
        "op": "replace",
        "cont": [
            {
                "keyMatch": "detail_(A|C)",
                "replacement": "detail_{{item.count}}_{{keyMatch.1}}"
            },
            {
                "valueMatch": "I will s(.*)",
                "replacement": "{{valueMatch.1}} yes"
            },
            {
                "valueMatch": "(.*) yes",
                "replacement": "{{valueMatch.1}} {{item.name}} DONE"
            }
        ]
    }
]
```

Nos dará el siguiente resultado:

```
[
  {
    "name": "A",
    "count": 3,
    "details": {
      "detail_A": "detail_3_A",
      "detail_B": "Don't remove me",
      "detail_C": "detail_3_C",
      "detail_D": "4055 help"
    }
  },
  {
    "name": "B",
    "count": 4,
    "details": {
      "detail_A": "detail_4_A",
      "detail_B": "Remove me",
      "detail_C": "detail_4_C",
      "detail_D": "334"
    }
  },
  {
    "name": "C",
    "count": 2,
    "details": {
      "detail_A": "detail_2_A",
      "detail_B": "Remove me",
      "detail_C": "detail_2_C",
      "detail_D": "3455 help"
    }
  },
  {
    "name": "D",
    "count": 5,
    "details": {
      "detail_A": "detail_5_A",
      "detail_B": "Don't remove me",
      "detail_C": "detail_5_C",
      "detail_D": "23"
    }
  }
]
```