      ___           ___           ___           ___
     /\  \         /\__\         /\  \         /\__\          ___
    /::\  \       /:/  /        /::\  \       /:/  /         /\  \
   /:/\ \  \     /:/  /        /:/\ \  \     /:/__/          \:\  \
  _\:\~\ \  \   /:/  /  ___   _\:\~\ \  \   /::\  \ ___      /::\__\
 /\ \:\ \ \__\ /:/__/  /\__\ /\ \:\ \ \__\ /:/\:\  /\__\  __/:/\/__/
 \:\ \:\ \/__/ \:\  \ /:/  / \:\ \:\ \/__/ \/__\:\/:/  / /\/:/  /
  \:\ \:\__\    \:\  /:/  /   \:\ \:\__\        \::/  /  \::/__/
   \:\/:/  /     \:\/:/  /     \:\/:/  /        /:/  /    \:\__\
    \::/  /       \::/  /       \::/  /        /:/  /      \/__/
     \/__/         \/__/         \/__/         \/__/



Sushi allows you to transform collections of JSON objects using a declarative syntax. We use it at [CityHeroes](http://cityhero.es/) to process the results of our RESTful APIs.

It's based on the concepts from [AssemblyLine](https://github.com/cityheroes/assembly-line), but there are several improvements:

- Extensible - you can add your custom *filters*, *transformations* and *aggregations*
- Minimal - only the basic processes are part of the core
- Independent - dependencies like *underscore* or *moment* are no longer required (at least for the core library)
- More powerful - new features and capabilities like variables, the core helper, enhanced path notation


## Basics

### Glosary

- Collection: Array of objects. This is the data set that Sushi processes.
- Item: An object, part of the array.
- Key: The object property that references a value within the object.
- Value: A value that can of any type
- Type: Object, Array, String, Number, Boolean, Null, Undefined

### Overview

Sushi receives a *collection* and outputs another collection after it applies a series of **steps** to it. The steps are in turn composed by **operations**, which can be:

### Overturn

Filters **keys** of the items of a collection.

### Filters

Filters **items** of a collection.

### Pickers

Pickers filter **keys** of the items of a collection.

### Mappers

Filters **keys** of the items of a collection.

### Usage