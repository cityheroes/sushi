## Remove

- **paths**: Array de *paths* que hay que quitar del item
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
			"detail_C": "I will survive",
			"detail_D": "3455 help"
		}
	},
	{
		"name": "D",
		"count": 5,
		"details": {
			"detail_A": 21,
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
      "op": "remove",
      "cont": {
         "paths": [
         	"count",
            "details.detail_A"
         ],
         "keyMatch": 21,
         "valueMatch": 15.4445
      }
   }
]
```

Nos dará el siguiente resultado:

```
[
   {
      "name": "A",
      "details": {
         "detail_C": "I will survive"
      }
   },
   {
      "name": "B",
      "details": {
         "detail_D": "334"
      }
   },
   {
      "name": "C",
      "details": {
         "detail_C": "I will survive"
      }
   },
   {
      "name": "D",
      "details": {
         "detail_C": "I will survive",
         "detail_D": "23"
      }
   }
]
```