
mProject
========

### Installation

The OpenShift `nodejs` cartridge documentation can be found at:

http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs

```bash
$ npm install
```


## API
Below is a table of addresses and actions  

| Verb  | Address               | Comments                                 |
|-------|-----------------------|------------------------------------------|
| GET   | /ingredients          | Returns a list of all ingredients        |
| GET   | /ingredients/{id}     | Returns a single ingredient (for update) |  
| POST  | /ingredients          | Inserts an ingredient                    |
| PUT   | /ingredients/{id}     | Updates an ingredient                    |
| DELETE| /ingredients/{id}     | Deletes an ingredient                    |

```js
{
    "id"    : int,
    "name"  : string
}
```

### People

The creator and father of mProject is [Clint McGee](https://github.com/clintmcgee)  
The author of mProject is [Bill Gauvey](https://github.com/bgauvey) 

### License

  [MIT](LICENSE)


