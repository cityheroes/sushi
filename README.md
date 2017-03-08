# Sushi

Sushi allows you to transform collections of JSON objects using a declarative syntax. We use it at [CityHeroes](http://cityhero.es/) to process the results of our RESTful APIs.

It's based on the concepts from [AssemblyLine](https://github.com/cityheroes/assembly-line), but there are several improvements:

- Extensible - you can add your custom *filters*, *transformations* and *aggregations*
- Minimal - only the basic processes are part of the core
- Independent - dependencies like *underscore* or *moment* are no longer required (at least for the core library)
- More powerful - new features and capabilities like variables, the core helper, enhanced path notation

