## Replace

- **keyMatch**: Un valor o expresión regular para seleccionar una llave para quitar del item (la comparación de tipo se aplica)
- **valueMatch**: Un valor o expresión regular para seleccionar una llave para quitar del item en base al **valor** (la comparación de tipo se aplica)
- **replacement**: El valor por el cual se hará el reemplazo si es que se encuentra algo. Puede contener FormulaValues.

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
                "valueMatch": "I will s(.*)",
                "replacement": "{{valueMatch.1}} yes"
            },
            {
                "valueMatch": "(.*) yes",
                "replacement": "{{valueMatch.1}} {{item.name}} DONE"
            },
            {
                "valueMatch": "(.*) DONE",
                "replacement": "{{value}} VALUE 111"
            },
            {
                "keyMatch": "detail_(A|C)",
                "replacement": "{{value}} :: {{keyMatch.1}}"
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
[
  {
    "name": "A",
    "count": 3,
    "details": {
      "detail_A": "39 :: A",
      "detail_B": "Don't remove me",
      "detail_C": "urvive A DONE VALUE 111 :: C",
      "detail_D": "4055 help"
    }
  },
  {
    "name": "B",
    "count": 4,
    "details": {
      "detail_A": "49 :: A",
      "detail_B": "Remove me",
      "detail_C": "15.4445 :: C",
      "detail_D": "334"
    }
  },
  {
    "name": "C",
    "count": 2,
    "details": {
      "detail_A": "37 :: A",
      "detail_B": "Remove me",
      "detail_C": "truggle C DONE VALUE 111 :: C",
      "detail_D": "3455 help"
    }
  },
  {
    "name": "D",
    "count": 5,
    "details": {
      "detail_A": "null :: A",
      "detail_B": "Don't remove me",
      "detail_C": "urvive D DONE VALUE 111 :: C",
      "detail_D": "23"
    }
  }
]
```
